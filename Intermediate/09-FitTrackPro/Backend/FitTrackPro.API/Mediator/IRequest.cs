namespace FitTrackPro.API.Mediator
{
    public interface IRequest<TRequest> {  }

    public interface IRequestHandler<TRequest, TResponse> where TRequest : IRequest<TResponse>
    { Task<TResponse> HandleAsync(TRequest request); }

    public interface IMediator
    { Task<TResponse> SendAsync<TResponse>(IRequest<TResponse> request); }

    public class SimpleMediator: IMediator
    {
        private readonly IServiceProvider _serviceProvider;

        public SimpleMediator(IServiceProvider serviceProvider)
        { _serviceProvider = serviceProvider; }

        public async Task<TResponse> SendAsync<TResponse>(IRequest<TResponse> request)
        {
            var handlerType = typeof(IRequestHandler<,>).MakeGenericType(request.GetType(), typeof(TResponse));
            dynamic handler = _serviceProvider.GetRequiredService(handlerType);
            return await handler.HandleAsync((dynamic)request);
        }
    }
}
