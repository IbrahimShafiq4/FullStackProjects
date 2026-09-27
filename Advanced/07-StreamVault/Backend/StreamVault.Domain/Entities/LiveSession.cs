using StreamVault.Domain.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace StreamVault.Domain.Entities
{
    public enum LiveSessionStatus { Scheduled = 1, Live = 2, Ended = 3 }
    public class LiveSession
    {
        public int                      Id              { get; set; }
        public string                   Title           { get; set; } = string.Empty;
        public LiveSessionStatus        Status          { get; set; } = LiveSessionStatus.Scheduled;
        public DateTime?                StartedAt       { get; set; }
        public DateTime?                EndedAt         { get; set; }
                                                        
        public int                      CourseId        { get; set; }
        public Course                   Course          { get; set; } = null!;

        public string                   InstructorId    { get; set; } = string.Empty;

        public List<RaisedHand>         RaisedHands      { get; set; } = new();
        public List<LiveChatMessage>    ChatMessages    { get; set; } = new();
    }
}
