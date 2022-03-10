import create from 'zustand';

export type InProgressUpload = {
  // on-device URI for the file being uploaded
  fileURI: string;
  // upload has finished
  finished: boolean;
  // upload has finished without error
  succeeded: boolean;
  // axios abort controller for cancellation
  controller: AbortController;
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
  setFinished: (contentId: string, succeeded: boolean) => void;
  clear: () => void;
};

export const useUploadStore = create<UploadState>((set, get) => ({
  uploads: undefined,
  setUploads: (mid: string, inProgress: Record<string, InProgressUpload>) => {
    set({uploads: {mid, inProgress}});
  },
  setFinished: (contentId: string, succeeded: boolean) => {
    const uploads = get().uploads;
    if (uploads != null) {
      uploads.inProgress[contentId].finished = true;
      uploads.inProgress[contentId].succeeded = succeeded;
      set({uploads});
    }
  },
  clear: () => set({uploads: undefined}),
}));
