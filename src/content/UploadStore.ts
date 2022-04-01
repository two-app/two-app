import create from 'zustand';

export type UploadStatus = 'processing' | 'uploading' | 'succeeded' | 'failed';

export type InProgressUpload = {
  // on-device URI for the file being uploaded
  fileURI: string;
  // stage
  status: 'processing' | 'uploading' | 'succeeded' | 'failed';
  // axios abort controller for cancellation
  controller?: AbortController;
};

export type UploadState = {
  uploads?: {
    mid: string;
    // contentId <-> upload
    inProgress: Record<string, InProgressUpload>;
  };
  setUploads: (
    mid: string,
    inProgress: Record<string, InProgressUpload>,
  ) => void;
  setStatus: (
    contentId: string,
    status: UploadStatus,
    controller?: AbortController,
  ) => void;
  clear: () => void;

  // selectors
  groupByStatus: () => Record<UploadStatus, InProgressUpload[]>;
};

export const useUploadStore = create<UploadState>((set, get) => ({
  uploads: undefined,
  setUploads: (mid: string, inProgress: Record<string, InProgressUpload>) => {
    set({uploads: {mid, inProgress}});
  },
  setStatus: (
    contentId: string,
    status: UploadStatus,
    controller?: AbortController,
  ) => {
    const uploads = get().uploads;
    if (uploads != null) {
      uploads.inProgress[contentId].status = status;
      uploads.inProgress[contentId].controller = controller;
      set({uploads});
    }
  },
  clear: () => set({uploads: undefined}),
  groupByStatus: (): Record<UploadStatus, InProgressUpload[]> => {
    const {inProgress} = get().uploads!;
    const contentIds = Object.keys(inProgress);
    const grouped: Record<UploadStatus, InProgressUpload[]> = {
      processing: [],
      uploading: [],
      succeeded: [],
      failed: [],
    };

    for (const contentId of contentIds) {
      const upload = inProgress[contentId];
      grouped[upload.status].push(upload);
    }

    return grouped;
  },
}));
