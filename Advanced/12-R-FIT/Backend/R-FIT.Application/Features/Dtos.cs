using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Application.Features
{
    public record PostDto(
        int             Id,
        string          Content,
        string          AuthorName,
        string?         AuthorAvatar,
        DateTime        CreatedAt,
        List<string>    Platforms,
        int             ReactionsCount,
        int             CommnetsCount,
        int             SharesCount
    );

    public record CreatePostDto(
        string          Content,
        List<string>    Platforms,
        List<string>?   HashTags
    );

    public record CommentDto(
        int         Id,
        string      Content,
        string      AuthorName,
        string?     AuthorAvatar,
        DateTime    CreatedAt,
        int?        ParentCommentId,
        int         RepliesCount
    );
}
