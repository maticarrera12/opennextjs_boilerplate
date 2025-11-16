export async function loadMessages(locale: string) {
  try {
    const messages = await import(`@/messages/${locale}.json`);
    return messages.default;
  } catch (error) {
    const messages = await import(`@/messages/en.json`);
    return messages.default || error;
  }
}
