const RESEND_ENDPOINT = "https://api.resend.com/emails";

// ต้องมีทั้ง API key และผู้ส่งที่ยืนยันโดเมนแล้ว จึงจะส่งอีเมลจริงได้
export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

// ระหว่างพัฒนาเครื่องตัวเอง (ยังไม่มีคีย์อีเมล) ให้ OTP ทำงานได้โดยพิมพ์รหัสลง log ของ dev server
export function isPasswordOtpEnabled() {
  return isEmailConfigured() || process.env.NODE_ENV !== "production";
}

export function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const visible = name.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(name.length - 2, 1))}@${domain}`;
}

function otpTemplate(code: string) {
  return `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#111827">
      <h1 style="font-size:20px;margin:0 0 12px">ยืนยันการเปลี่ยนรหัสผ่าน</h1>
      <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 20px">
        ใช้รหัสด้านล่างเพื่อยืนยันการเปลี่ยนรหัสผ่าน EGT-Learning รหัสมีอายุ 10 นาที
      </p>
      <div style="font-size:28px;font-weight:700;letter-spacing:8px;padding:16px 20px;background:#f3f4f6;border-radius:10px;text-align:center">${code}</div>
      <p style="font-size:12px;line-height:1.6;color:#6b7280;margin:24px 0 0">
        หากคุณไม่ได้เป็นผู้ขอเปลี่ยนรหัสผ่าน ไม่ต้องทำอะไร รหัสผ่านเดิมยังใช้งานได้ตามปกติ
      </p>
    </div>
  `;
}

export async function sendOtpEmail({ to, code }: { to: string; code: string }) {
  if (!isEmailConfigured()) {
    // ไม่มีคีย์อีเมล: ใน dev พิมพ์รหัสลง console เพื่อทดสอบ flow ได้
    if (process.env.NODE_ENV !== "production") {
      console.log(`[dev] OTP for ${to}: ${code}`);
      return { delivered: false as const };
    }
    throw new Error("EMAIL_NOT_CONFIGURED");
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM,
      to: [to],
      subject: "รหัสยืนยันการเปลี่ยนรหัสผ่าน EGT-Learning",
      html: otpTemplate(code),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Send OTP email failed:", res.status, detail.slice(0, 300));
    throw new Error("EMAIL_SEND_FAILED");
  }

  return { delivered: true as const };
}
