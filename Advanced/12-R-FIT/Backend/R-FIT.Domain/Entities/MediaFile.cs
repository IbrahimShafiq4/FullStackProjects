using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public enum MediaUploadStatus { InProgress = 1, Completed = 2, Failed = 3 }
    public class MediaFile
    {
        public int                  Id              { get; set; }
        public string               FileName        { get; set; } = string.Empty;
        public string?              StoragePath     { get; set; }
        public long                 TotalSizeBytes  { get; set; }
        public int                  TotalChunks     { get; set; }
        public int                  UploadedChunks  { get; set; } = 0;
        public MediaUploadStatus    Status          { get; set; } = MediaUploadStatus.InProgress;

        public int?                 PostId          { get; set; }
        public Post?                Post            { get; set; }
    }
}
