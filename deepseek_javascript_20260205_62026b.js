// Kod do wklejenia w Google Apps Script
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Otwórz Google Sheet
    const sheet = SpreadsheetApp.openById('TWÓJ_ID_SHEET').getSheetByName('Zamówienia');
    
    // Przygotuj dane do wstawienia
    const rowData = [
      new Date(), // Timestamp
      data.childName,
      data.childAge,
      data.gender,
      data.world,
      data.values.join(', '),
      data.specialNotes || '',
      data.package === 'premium' ? 'Bajka Premium' : 'Bajka Ekspres',
      data.email,
      data.phone || '',
      'Nowe', // Status
      '', // Data wysłania
      '' // Notatki
    ];
    
    // Dodaj do arkusza
    sheet.appendRow(rowData);
    
    // Wyślij potwierdzenie do klienta
    sendConfirmationEmail(data);
    
    // Wyślij powiadomienie do siebie
    sendNotificationToAdmin(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Zamówienie zapisane!'}))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendConfirmationEmail(data) {
  const subject = `Bajka dla ${data.childName} - Potwierdzenie zamówienia`;
  const body = `
Cześć!

Dziękujemy za zamówienie personalizowanej bajki dla ${data.childName}!

📋 Szczegóły zamówienia:
- Pakiet: ${data.package === 'premium' ? 'Bajka Premium (39 PLN)' : 'Bajka Ekspres (19 PLN)'}
- Świat: ${data.world}
- Wartości: ${data.values.join(', ')}
- Czas realizacji: ${data.package === 'premium' ? 'do 12 godzin' : 'do 24 godzin'}

💰 Płatność:
Prosimy o przelew na konto:
Bank: [Twój Bank]
Nr konta: [Twoje konto]
Tytuł: Bajka dla ${data.childName}
Kwota: ${data.package === 'premium' ? '39 PLN' : '19 PLN'}

Po zaksięgowaniu przelewu rozpoczniemy tworzenie bajki.

Magicznego dnia! ✨

Zespół Bajkomistrz
  `;
  
  MailApp.sendEmail(data.email, subject, body);
}

function sendNotificationToAdmin(data) {
  const subject = `🎉 NOWE ZAMÓWIENIE: ${data.childName}`;
  const body = `
Nowe zamówienie!

Dane:
- Dziecko: ${data.childName}, ${data.childAge} lat
- Pakiet: ${data.package}
- Świat: ${data.world}
- Email: ${data.email}
- Telefon: ${data.phone || 'nie podano'}

Link do arkusza: [LINK_DO_TWOJEGO_SHEETS]
  `;
  
  MailApp.sendEmail('twój.email@gmail.com', subject, body);
}