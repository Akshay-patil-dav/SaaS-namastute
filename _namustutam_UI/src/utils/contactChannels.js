export function resolveContactChannels(contact = {}) {
    const brandName = (contact.brandName || 'Namustutam').trim();
    const rawEmail = (contact.email ?? '').trim();
    const rawPhone = (contact.phone ?? '').trim();
    const rawWhatsapp = (contact.whatsapp ?? '').trim();
    const rawLocation = (contact.location ?? '').trim();
    const rawHours = (contact.supportHours ?? '').trim();

    const showEmail = contact.showEmail !== false && Boolean(rawEmail);
    const showPhone = contact.showPhone !== false && Boolean(rawPhone || rawWhatsapp);
    const showLocation = contact.showLocation !== false && Boolean(rawLocation);
    const showHours = contact.showHours !== false && Boolean(rawHours);

    const phoneDisplay = rawWhatsapp || rawPhone;
    const cleanWhatsapp = (rawWhatsapp || rawPhone).replace(/[^0-9]/g, '');
    const cleanPhone = (rawPhone || rawWhatsapp).replace(/[^0-9+]/g, '');
    const whatsappUrl = cleanWhatsapp ? `https://wa.me/${cleanWhatsapp}` : '';
    const phoneTelUrl = cleanPhone ? `tel:${cleanPhone}` : '';
    const primaryPhoneLink = rawWhatsapp ? whatsappUrl : phoneTelUrl;

    return {
        brandName,
        rawEmail,
        rawPhone,
        rawWhatsapp,
        rawLocation,
        rawHours,
        showEmail,
        showPhone,
        showLocation,
        showHours,
        phoneDisplay,
        whatsappUrl,
        phoneTelUrl,
        primaryPhoneLink,
        isWhatsappPreferred: Boolean(rawWhatsapp),
        hasAnyChannel: showEmail || showPhone || showLocation || showHours
    };
}

