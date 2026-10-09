using Microsoft.EntityFrameworkCore;
using R_FIT.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Application.Interfaces
{
    public interface IAppDbContext
    {
        DbSet<PlatformProfile>      PlatformProfiles    { get; }
        DbSet<Post>                 Posts               { get; }
        DbSet<PostTarget>           PostTargets         { get; }
        DbSet<MediaFile>            MediaFiles          { get; }
        DbSet<Comment>              Comments            { get; }
        DbSet<Reaction>             Reactions           { get; }
        DbSet<Share>                Shares              { get; }
        DbSet<Follow>               Follows             { get; }
        DbSet<UserSettings>         UserSettings        { get; }
        DbSet<Notification>         Notifications       { get; }
        DbSet<Story>                Stories             { get; }
        DbSet<StoryView>            StoryViews          { get; }
        DbSet<DirectMessage>        DirectMessages      { get; }
        DbSet<Hashtag>              Hashtags            { get; }
        DbSet<PostHashtag>          PostHashtags        { get; }
        DbSet<Bookmark>             Bookmarks           { get; }
        DbSet<Block>                Blocks              { get; }
        DbSet<ProfileVisit>         ProfileVisits       { get; }
        DbSet<SilentMode>           SilentModes         { get; }
        DbSet<QuietHoursSetting>    QuietHoursSettings  { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
