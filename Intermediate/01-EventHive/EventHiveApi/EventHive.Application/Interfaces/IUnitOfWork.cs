using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Application.Interfaces
{
    public interface IUnitOfWork: IDisposable
    {
        IEventRepository EventsRepository { get; }
        Task<int> CompleteAsync();
    }
}
