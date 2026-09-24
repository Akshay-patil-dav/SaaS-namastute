/**
 * WhatsApp Messaging & Auto-Dispatch Service
 * 
 * Supports:
 * 1. Meta WhatsApp Cloud API (Automated background dispatch, zero windows)
 * 2. Custom HTTP Gateway (UltraMsg, Maytapi, GreenAPI, Baileys Webhook)
 * 3. High-compatibility Direct Web / Mobile Dispatch (Popup-safe anchor click)
 */

/**
 * Default Reference Meta Cloud API Credentials (From verified Meta Developer App)
 */
export const DEFAULT_META_PHONE_ID = '1281932198343073';
export const DEFAULT_META_TOKEN = 'EAAWchq3he7gBSsIMXKAurVGBIdKqNxHDI5bgZCkhxXpqiJAKx9zwsS18m8GmEZAWsobVmzZB8Iy1EdxbN6M4E12r9mSvfe8vqqBilL3oKuCnG65vVqAXLOpF8fhWUA3n9lCcG8dOnj9jjMvrhW4Fe2ztPPtRqNxVLcSRVcZCsbnvEx69voxP4GgDeUKp4KK5xGEYntZBzJbSikdlOnX0EqQkchyelqBRh1rNNp4n8HZB16sZCrMK9ZBBBGw0r3AuJyKYMq3AcEwLDJon1i3JZBVsJ';
/**
 * Standard Professional Invoice / Receipt Template
 */
export const DEFAULT_WHATSAPP_TEMPLATE =
    `━━━━━━━━━━━━━━━━━━━━━━
🧾 *TAX INVOICE / RECEIPT*
🏪 *{store_name}*
━━━━━━━━━━━━━━━━━━━━━━

👤 *Customer:* {customer_name}
📄 *Invoice #:* #{invoice_no}
📅 *Date:* {date}
💳 *Payment Status:* {payment_status}

━━━━━━━━━━━━━━━━━━━━━━
📦 *PURCHASED ITEMS:*
{items}
━━━━━━━━━━━━━━━━━━━━━━

💰 *TOTAL AMOUNT:* *{amount}*
{balance_section}
{payment_section}
✨ _Thank you for shopping with us!_
📞 _For queries or support, please reply to this message._
━━━━━━━━━━━━━━━━━━━━━━`;

/**
 * Clean & Format phone number with country code
 * - Strips any non-numeric characters
 * - Strips leading zeros (e.g. 09876543210 -> 9876543210)
 * - Automatically prepends default country code (default: 91 for India) if 10 digits
 */
export const formatWhatsAppPhone = (phone = '', defaultCountryCode = '91') => {
    let clean = String(phone || '').replace(/[^0-9]/g, '');
    const cleanCountry = String(defaultCountryCode || '91').replace(/[^0-9]/g, '') || '91';

    if (!clean) return '';

    // Strip leading zeroes (e.g. 09876543210 -> 9876543210 or 0091... -> 91...)
    clean = clean.replace(/^0+/, '');

    // If 10 digits, prepend the default country code
    if (clean.length === 10) {
        clean = `${cleanCountry}${clean}`;
    }

    return clean;
};

/**
 * Check if the client is running on a mobile / tablet browser
 */
export const isMobileDevice = () => {
    if (typeof navigator === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Build direct WhatsApp Web / App URL
 * - Desktop: Opens web.whatsapp.com directly (bypasses wa.me intermediate screen)
 * - Mobile: Uses api.whatsapp.com to trigger native WhatsApp app
 * - Desktop app mode: Uses whatsapp:// protocol
 */
export const getWhatsAppDirectUrl = (phone, message, mode = 'direct') => {
    const cleanPhone = formatWhatsAppPhone(phone);
    const encodedText = encodeURIComponent(message || '');

    if (mode === 'desktop') {
        return `whatsapp://send?phone=${cleanPhone}&text=${encodedText}`;
    }

    if (isMobileDevice()) {
        return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    }

    // Direct WhatsApp Web compose on Desktop
    return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
};

/**
 * Dispatch WhatsApp URL safely without being blocked by browser popup blockers
 */
export const dispatchWhatsAppLink = (url) => {
    if (!url || typeof document === 'undefined') return false;
    try {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        document.body.appendChild(anchor);
        anchor.click();
        setTimeout(() => {
            try {
                if (document.body.contains(anchor)) {
                    document.body.removeChild(anchor);
                }
            } catch { }
        }, 300);
        return true;
    } catch {
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        return !!win;
    }
};

/**
 * Compile dynamic template tags with invoice/order/khata data
 * Robustly handles aliases, arrays of products, and removes leftover placeholders
 */
export const compileWhatsAppTemplate = (template, data = {}) => {
    let tpl = template && template.trim() ? template : DEFAULT_WHATSAPP_TEMPLATE;

    const custName = data.customerName || data.customer_name || data.customer?.name || data.clientName || 'Valued Customer';
    const store = data.storeName || data.store_name || data.companyName || 'Samrajya Store';

    // Normalize invoice number (prevent duplicate ##)
    const rawInv = data.invoiceNo || data.invoice_no || data.referenceNo || data.billNo || 'INV-001';
    const invNo = String(rawInv).replace(/^#+/, '');

    const amt = data.amount || data.grandTotal || data.total || '₹0.00';
    const payStatus = (data.paymentStatus || data.payment_status || 'PAID').toUpperCase();
    const dateStr = data.date || data.orderDate || new Date().toLocaleDateString();
    const timeStr = data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Handle items
    let itemsStr = 'General POS Items';
    if (Array.isArray(data.items)) {
        itemsStr = data.items.map(p => {
            const name = p.name || p.productName || 'Item';
            const qty = p.quantity || p.qty || 1;
            const price = p.price || p.unitPrice || '';
            return `• ${name} (x${qty})${price ? ` - ${price}` : ''}`;
        }).join('\n');
    } else if (typeof data.items === 'string' && data.items.trim()) {
        itemsStr = data.items.trim();
    } else if (typeof data.itemsList === 'string' && data.itemsList.trim()) {
        itemsStr = data.itemsList.trim();
    }

    // Optional payment and due balance sections
    let balanceSection = '';
    const dueAmt = data.dueAmount || data.due || data.balance;
    if (dueAmt && dueAmt !== '0' && dueAmt !== '₹0.00' && payStatus !== 'PAID') {
        balanceSection = `\n⚠️ *Pending Due Balance:* *${dueAmt}*`;
    }

    let paymentSection = '';
    const upiLink = data.paymentLink || data.upiUri || data.upiUrl;
    if (upiLink && payStatus !== 'PAID') {
        paymentSection = `\n📲 *Pay Online via UPI (GPay/PhonePe):*\n${upiLink}\n`;
    }

    let compiled = tpl
        // Customer Name
        .replace(/{customer_name}/gi, custName)
        .replace(/{customerName}/gi, custName)
        .replace(/{customer}/gi, custName)
        // Store Name
        .replace(/{store_name}/gi, store)
        .replace(/{storeName}/gi, store)
        .replace(/{company_name}/gi, store)
        // Invoice Number
        .replace(/{invoice_no}/gi, invNo)
        .replace(/{invoiceNo}/gi, invNo)
        .replace(/{bill_no}/gi, invNo)
        .replace(/{reference_no}/gi, invNo)
        // Amount / Grand Total
        .replace(/{amount}/gi, amt)
        .replace(/{grand_total}/gi, amt)
        .replace(/{grandTotal}/gi, amt)
        .replace(/{total}/gi, amt)
        // Items
        .replace(/{items}/gi, itemsStr)
        .replace(/{items_list}/gi, itemsStr)
        // Payment Status
        .replace(/{payment_status}/gi, payStatus)
        .replace(/{paymentStatus}/gi, payStatus)
        .replace(/{status}/gi, payStatus)
        // Date & Time
        .replace(/{date}/gi, dateStr)
        .replace(/{time}/gi, timeStr)
        // Balance & UPI Sections
        .replace(/{balance_section}/gi, balanceSection)
        .replace(/{due_amount}/gi, dueAmt || '')
        .replace(/{payment_section}/gi, paymentSection)
        .replace(/{payment_link}/gi, upiLink || '');

    // If custom template didn't have {items}, append items cleanly
    if (!tpl.includes('{items}') && !tpl.includes('{items_list}') && itemsStr && itemsStr !== 'General POS Items') {
        compiled += `\n\n━━━━━━━━━━━━━━━━━━━━━━\n📦 *PURCHASED ITEMS:*\n${itemsStr}`;
    }

    // Clean up any remaining unfilled placeholders (e.g. {unsupported_tag})
    compiled = compiled.replace(/\{[a-zA-Z0-9_-]+\}/g, '').replace(/\n{3,}/g, '\n\n').trim();

    return compiled;
};

/**
 * Send WhatsApp message in background WITHOUT opening WhatsApp
 * Supports:
 * 1. Meta Cloud API (graph.facebook.com)
 * 2. Custom HTTP Gateway (UltraMsg, Maytapi, GreenAPI, Baileys gateway)
 * 3. Fallback to Click-to-Chat with popup-safe dispatcher
 */
export const sendWhatsAppMessage = async ({
    phone,
    message,
    settings = {},
    forceWeb = false,
    phoneId = null,
    token = null,
    apiVersion = null,
    templateName = null,
    templateLanguage = 'en_US',
    fallbackTemplateOn24h = true,
    _fallbackReason = null  // internal: '24h_window' | 'sandbox_restriction' | null
}) => {
    const defaultCountry = settings.whatsappCountryCode || '91';
    const cleanPhone = formatWhatsAppPhone(phone, defaultCountry);

    if (!cleanPhone) {
        throw new Error('Valid recipient mobile number with country code is required.');
    }

    const mode = settings.whatsappMode || 'cloud_api';
    const targetPhoneId = (phoneId || settings.whatsappPhoneId || DEFAULT_META_PHONE_ID).trim();

    // Clean token: Remove any accidental "Bearer " prefix pasted from developer console
    let targetToken = (token || settings.whatsappToken || DEFAULT_META_TOKEN).trim();
    targetToken = targetToken.replace(/^Bearer\s+/i, '').trim();

    const apiVer = (apiVersion || settings.whatsappApiVersion || 'v22.0').trim().replace(/^\/+|\/+$/g, '');

    const isBackgroundEnabled = settings.whatsappBackgroundAutoSend === 'true' ||
        mode === 'cloud_api' ||
        mode === 'gateway' ||
        !!(targetPhoneId && targetToken);

    // ── 1. Meta WhatsApp Cloud API (Background, zero windows) ──
    if (!forceWeb && (mode === 'cloud_api' || (isBackgroundEnabled && targetPhoneId && targetToken))) {
        if (!targetPhoneId || !targetToken) {
            throw new Error('Meta WhatsApp Cloud API requires Phone Number ID and Permanent Access Token. Please configure them in Settings > Connected Apps.');
        }

        // Dynamic Meta Graph API endpoint
        const url = `https://graph.facebook.com/${apiVer}/${targetPhoneId}/messages`;

        let payload;
        if (templateName) {
            // Official Meta Template Message (e.g. hello_world demo template)
            payload = {
                messaging_product: 'whatsapp',
                to: cleanPhone,
                type: 'template',
                template: {
                    name: templateName,
                    language: {
                        code: templateLanguage || 'en_US'
                    }
                }
            };
        } else {
            // Standard Text Message (POS Invoice or Custom Alert)
            payload = {
                messaging_product: 'whatsapp',
                to: cleanPhone,
                type: 'text',
                text: {
                    preview_url: false,
                    body: message
                }
            };
        }

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${targetToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            const errObj = json?.error || {};

            // If text message fails because of Meta's 24-hour service window policy,
            // automatically dispatch Meta's official template (hello_world) so the message is DELIVERED!
            if (errObj.code === 131047 && !templateName && fallbackTemplateOn24h) {
                console.log(`[Meta Cloud API] 24h window closed for +${cleanPhone}. Automatically dispatching Meta official template [hello_world]...`);
                return await sendWhatsAppMessage({
                    phone: cleanPhone,
                    message,
                    settings,
                    forceWeb: false,
                    phoneId: targetPhoneId,
                    token: targetToken,
                    templateName: 'hello_world',
                    templateLanguage: 'en_US',
                    fallbackTemplateOn24h: false,
                    _fallbackReason: '24h_window'
                });
            }

            // If text message fails because recipient is not in Meta Sandbox allowed numbers,
            // automatically dispatch hello_world template which bypasses sandbox restrictions!
            if (errObj.code === 131030 && !templateName && fallbackTemplateOn24h) {
                console.log(`[Meta Cloud API] Sandbox restriction for +${cleanPhone}. Automatically dispatching Meta official template [hello_world] which bypasses sandbox limit...`);
                return await sendWhatsAppMessage({
                    phone: cleanPhone,
                    message,
                    settings,
                    forceWeb: false,
                    phoneId: targetPhoneId,
                    token: targetToken,
                    templateName: 'hello_world',
                    templateLanguage: 'en_US',
                    fallbackTemplateOn24h: false,
                    _fallbackReason: 'sandbox_restriction'
                });
            }

            let friendlyMsg = errObj.message || `Meta Cloud API error (status ${res.status})`;

            // Map common Meta Cloud API error codes to actionable advice
            if (errObj.code === 131047) {
                friendlyMsg = 'Meta 24-Hour Window Policy: Outside of the 24-hour service window, Meta only permits sending pre-approved Template Messages (such as the "hello_world" demo template). Please select Template mode or have the recipient message you first.';
            } else if (errObj.code === 190) {
                friendlyMsg = 'Meta Access Token is invalid or expired. Please generate a new System User Permanent Token in Meta Business Manager.';
            } else if (errObj.code === 100) {
                friendlyMsg = `Meta API Invalid Parameter: ${errObj.error_data?.details || errObj.message || 'Check Phone Number ID and recipient number.'}`;
            } else if (errObj.code === 131030) {
                friendlyMsg = `Recipient (+${cleanPhone}) is not registered in your Meta Developer Sandbox test numbers. Please add this number to the Allowed Numbers list in Meta Developer Portal.`;
            } else if (errObj.error_data?.details) {
                friendlyMsg += ` (${errObj.error_data.details})`;
            }

            throw new Error(friendlyMsg);
        }

        return {
            success: true,
            provider: 'meta_cloud_api',
            messageId: json.messages?.[0]?.id || 'delivered',
            phone: cleanPhone,
            background: true,
            isTemplate: !!templateName,
            templateName: templateName || null,
            fallbackReason: _fallbackReason || null,
            response: json
        };
    }

    // ── 2. Custom HTTP Gateway (UltraMsg / GreenAPI / Maytapi / Local Gateway) ──
    if (!forceWeb && (mode === 'gateway' || (isBackgroundEnabled && settings.whatsappGatewayUrl))) {
        const gatewayUrl = (settings.whatsappGatewayUrl || '').trim();
        const gatewayToken = (settings.whatsappGatewayToken || '').trim();

        if (!gatewayUrl) {
            throw new Error('Custom Gateway requires a valid Gateway Endpoint URL.');
        }

        const payload = {
            to: cleanPhone,
            phone: cleanPhone,
            number: cleanPhone,
            message: message,
            body: message,
            token: gatewayToken,
            tokenSecret: gatewayToken
        };

        const headers = { 'Content-Type': 'application/json' };
        if (gatewayToken) {
            headers['Authorization'] = `Bearer ${gatewayToken}`;
            headers['x-api-key'] = gatewayToken;
        }

        const res = await fetch(gatewayUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        const json = await res.json().catch(() => ({ status: res.status }));

        if (!res.ok && res.status !== 0) {
            throw new Error(json?.message || `Gateway returned error status ${res.status}`);
        }

        return {
            success: true,
            provider: 'http_gateway',
            phone: cleanPhone,
            background: true,
            response: json
        };
    }

    // ── 3. Background Dispatch Guard ──
    if (isBackgroundEnabled && !forceWeb) {
        throw new Error('Background sending without opening WhatsApp requires Meta Cloud API credentials or a Gateway URL. Please configure them in Settings > Connected Apps, or switch to Direct WhatsApp Web.');
    }

    // ── 4. Direct Fallback: Click-to-Chat / Web WhatsApp ──
    const waUrl = getWhatsAppDirectUrl(cleanPhone, message, settings.whatsappMode || 'direct');
    const opened = dispatchWhatsAppLink(waUrl);

    return {
        success: true,
        provider: 'click_to_chat',
        phone: cleanPhone,
        url: waUrl,
        background: false,
        opened: opened
    };
};
