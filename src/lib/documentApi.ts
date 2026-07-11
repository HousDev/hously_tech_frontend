import api, { unwrap, type ApiResponse } from "./api";

export interface DocumentTemplateRecord {
  id?: number;
  name: string;
  category: 'Offer Letter' | 'Pay Slip' | 'Contract' | 'Agreement' | 'Custom';
  variables: number;
  updated: string;
  status: 'Approved' | 'Pending Approval' | 'Rejected';
  content?: string | null;
  logoUrl?: string | null;
  sealUrl?: string | null;
  sigUrl?: string | null;
  sealX?: number;
  sealY?: number;
  sealWidth?: number;
  sigX?: number;
  sigY?: number;
  sigWidth?: number;
}

export interface GeneratedDocumentRecord {
  id: string;
  name: string;
  type: string;
  status: 'Generated' | 'Draft' | 'Pending';
  format: string;
  date: string;
  employeeId: string;
}

export const documentApi = {
  // Templates API
  getAllTemplates: (): Promise<DocumentTemplateRecord[]> =>
    unwrap(api.get<ApiResponse<DocumentTemplateRecord[]>>('/document-templates')),

  getTemplateById: (id: number): Promise<DocumentTemplateRecord> =>
    unwrap(api.get<ApiResponse<DocumentTemplateRecord>>(`/document-templates/${id}`)),

  createTemplate: (payload: Omit<DocumentTemplateRecord, "id">): Promise<DocumentTemplateRecord> =>
    unwrap(api.post<ApiResponse<DocumentTemplateRecord>>('/document-templates', payload)),

  updateTemplate: (id: number, payload: Partial<DocumentTemplateRecord>): Promise<DocumentTemplateRecord> =>
    unwrap(api.put<ApiResponse<DocumentTemplateRecord>>(`/document-templates/${id}`, payload)),

  deleteTemplate: (id: number): Promise<void> =>
    unwrap(api.delete<ApiResponse<void>>(`/document-templates/${id}`)),

  // Documents API
  getAllDocuments: (): Promise<GeneratedDocumentRecord[]> =>
    unwrap(api.get<ApiResponse<GeneratedDocumentRecord[]>>('/generated-documents')),

  createDocument: (payload: GeneratedDocumentRecord): Promise<GeneratedDocumentRecord> =>
    unwrap(api.post<ApiResponse<GeneratedDocumentRecord>>('/generated-documents', payload)),

  deleteDocument: (id: string): Promise<void> =>
    unwrap(api.delete<ApiResponse<void>>(`/generated-documents/${id}`)),

  sendDocumentEmail: (payload: { email: string; subject: string; body: string; pdfBase64: string; filename: string }): Promise<{ success: boolean; message: string }> =>
    unwrap(api.post<ApiResponse<{ success: boolean; message: string }>>('/generated-documents/send-email', payload))
};
