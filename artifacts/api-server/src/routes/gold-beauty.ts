import { Router } from "express";
import { db, gbOrdersTable, gbSiteConfigTable, gbImagesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// ─── ORDERS ─────────────────────────────────────────────────────────────────

router.get("/gb/orders", async (req, res) => {
  try {
    const orders = await db.select().from(gbOrdersTable).orderBy(desc(gbOrdersTable.createdAt));
    res.json({ success: true, orders });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch orders");
    res.status(500).json({ success: false, error: "Failed to fetch orders" });
  }
});

router.post("/gb/orders", async (req, res) => {
  try {
    const body = req.body;
    if (!body.id || !body.customer || !body.phone) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    const [order] = await db.insert(gbOrdersTable).values({
      id: body.id,
      customer: body.customer,
      email: body.email ?? "",
      phone: body.phone,
      address: body.address ?? "",
      city: body.city ?? "",
      items: body.items ?? [],
      subtotal: String(body.subtotal ?? 0),
      deliveryFee: String(body.deliveryFee ?? 0),
      total: String(body.total ?? 0),
      status: body.status ?? "Pending",
      paymentMethod: body.paymentMethod ?? "COD",
      trackingNumber: body.trackingNumber ?? null,
      courierName: body.courierName ?? null,
      courierUrl: body.courierUrl ?? null,
      notes: body.notes ?? null,
    }).returning();
    res.status(201).json({ success: true, order });
  } catch (err) {
    req.log.error({ err }, "Failed to create order");
    res.status(500).json({ success: false, error: "Failed to create order" });
  }
});

router.patch("/gb/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const allowed: Record<string, unknown> = {};
    if (body.status !== undefined) allowed.status = body.status;
    if (body.trackingNumber !== undefined) allowed.trackingNumber = body.trackingNumber;
    if (body.courierName !== undefined) allowed.courierName = body.courierName;
    if (body.courierUrl !== undefined) allowed.courierUrl = body.courierUrl;
    if (body.notes !== undefined) allowed.notes = body.notes;
    allowed.updatedAt = new Date();
    const [updated] = await db.update(gbOrdersTable).set(allowed).where(eq(gbOrdersTable.id, id)).returning();
    if (!updated) return res.status(404).json({ success: false, error: "Order not found" });
    res.json({ success: true, order: updated });
  } catch (err) {
    req.log.error({ err }, "Failed to update order");
    res.status(500).json({ success: false, error: "Failed to update order" });
  }
});

router.delete("/gb/orders/:id", async (req, res) => {
  try {
    await db.delete(gbOrdersTable).where(eq(gbOrdersTable.id, req.params.id));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete order");
    res.status(500).json({ success: false, error: "Failed to delete order" });
  }
});

// ─── SITE CONFIG ─────────────────────────────────────────────────────────────

router.get("/gb/config", async (req, res) => {
  try {
    const rows = await db.select().from(gbSiteConfigTable);
    const config: Record<string, unknown> = {};
    for (const row of rows) config[row.key] = row.value;
    res.json({ success: true, config });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch config");
    res.status(500).json({ success: false, error: "Failed to fetch config" });
  }
});

router.put("/gb/config/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const value = req.body.value;
    await db.insert(gbSiteConfigTable)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({ target: gbSiteConfigTable.key, set: { value, updatedAt: new Date() } });
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to save config key");
    res.status(500).json({ success: false, error: "Failed to save config" });
  }
});

router.put("/gb/config", async (req, res) => {
  try {
    const entries = req.body as Record<string, unknown>;
    for (const [key, value] of Object.entries(entries)) {
      await db.insert(gbSiteConfigTable)
        .values({ key, value: value as never, updatedAt: new Date() })
        .onConflictDoUpdate({ target: gbSiteConfigTable.key, set: { value: value as never, updatedAt: new Date() } });
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to bulk save config");
    res.status(500).json({ success: false, error: "Failed to save config" });
  }
});

// ─── IMAGE UPLOAD (Cloudinary via direct URL) ─────────────────────────────

router.post("/gb/images", async (req, res) => {
  try {
    const { fieldName, url, publicId } = req.body;
    if (!fieldName || !url) return res.status(400).json({ success: false, error: "fieldName and url are required" });
    const [img] = await db.insert(gbImagesTable).values({ fieldName, url, publicId: publicId ?? null }).returning();
    res.status(201).json({ success: true, image: img });
  } catch (err) {
    req.log.error({ err }, "Failed to save image");
    res.status(500).json({ success: false, error: "Failed to save image" });
  }
});

router.get("/gb/images/:fieldName", async (req, res) => {
  try {
    const images = await db.select().from(gbImagesTable)
      .where(eq(gbImagesTable.fieldName, req.params.fieldName))
      .orderBy(desc(gbImagesTable.createdAt)).limit(1);
    res.json({ success: true, image: images[0] ?? null });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch image");
    res.status(500).json({ success: false, error: "Failed to fetch image" });
  }
});

// ─── CLOUDINARY UPLOAD PROXY ─────────────────────────────────────────────────
// Proxies upload to Cloudinary using server-side credentials

router.post("/gb/upload", async (req, res) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      return res.status(503).json({
        success: false,
        error: "Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in environment secrets."
      });
    }
    const { file, folder } = req.body;
    if (!file) return res.status(400).json({ success: false, error: "file (base64) is required" });

    const formData = new URLSearchParams();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    if (folder) formData.append("folder", folder);

    const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await cloudRes.json() as { secure_url?: string; public_id?: string; error?: { message: string } };
    if (!cloudRes.ok || data.error) {
      return res.status(500).json({ success: false, error: data.error?.message ?? "Cloudinary upload failed" });
    }
    res.json({ success: true, url: data.secure_url, publicId: data.public_id });
  } catch (err) {
    req.log.error({ err }, "Upload proxy error");
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

export default router;
