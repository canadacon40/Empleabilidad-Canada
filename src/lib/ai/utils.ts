/**
 * Removes internal admin-only fields from AI Module content
 * before displaying to clients or exporting to PDF.
 */
export function sanitizeAIContent(content: any) {
  if (!content) return {};
  
  // Create a deep copy
  const sanitized = JSON.parse(JSON.stringify(content));
  
  // Remove sensitive metadata
  delete sanitized._qualityAudit;
  delete sanitized._opsMetadata;
  delete sanitized.internalNotes;
  delete sanitized.rawPrompt;
  
  return sanitized;
}
