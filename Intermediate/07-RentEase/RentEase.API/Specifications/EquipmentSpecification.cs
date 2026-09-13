using RentEase.API.Models;
using System.Linq.Expressions;

namespace RentEase.API.Specifications
{
    public class EquipmentSpecification
    {
        public Expression<Func<Equipment, bool>> Criteria { get; private set; } = e => true;

        public EquipmentSpecification WithMaxPrice(decimal? maxPrice)
        {
            if (maxPrice.HasValue)
            {
                var parameter = Expression.Parameter(typeof(Equipment), "e");
                var body = Expression.AndAlso(
                    ReplaceParameter(Criteria.Body, Criteria.Parameters[0], parameter),
                    Expression.LessThanOrEqual(
                        Expression.Property(parameter, nameof(Equipment.PricePerDay)),
                        Expression.Constant(maxPrice.Value)
                    )
                );
                Criteria = Expression.Lambda<Func<Equipment, bool>>(body, parameter);
            }
            return this;
        }

        public EquipmentSpecification WithCategory(string? category)
        {
            if (!string.IsNullOrWhiteSpace(category))
            {
                var parameter = Expression.Parameter(typeof(Equipment), "e");
                var body = Expression.AndAlso(
                    ReplaceParameter(Criteria.Body, Criteria.Parameters[0], parameter),
                    Expression.Equal(
                        Expression.Property(parameter, nameof(Equipment.Category)),
                        Expression.Constant(category)
                    )
                );
                Criteria = Expression.Lambda<Func<Equipment, bool>>(body, parameter);
            }
            return this;
        }

        public EquipmentSpecification AvailableOnly()
        {
            var parameter = Expression.Parameter(typeof(Equipment), "e");
            var body = Expression.AndAlso(
                ReplaceParameter(Criteria.Body, Criteria.Parameters[0], parameter),
                Expression.Property(parameter, nameof(Equipment.IsAvailable))
            );
            Criteria = Expression.Lambda<Func<Equipment, bool>>(body, parameter);
            return this;
        }

        private static Expression ReplaceParameter(Expression body, ParameterExpression oldParameter, ParameterExpression newParameter)
        {
            return new ParameterReplacer(oldParameter, newParameter).Visit(body)!;
        }

        private class ParameterReplacer : ExpressionVisitor
        {
            private readonly ParameterExpression _oldParameter;
            private readonly ParameterExpression _newParameter;

            public ParameterReplacer(ParameterExpression oldParameter, ParameterExpression newParameter)
            {
                _oldParameter = oldParameter;
                _newParameter = newParameter;
            }

            protected override Expression VisitParameter(ParameterExpression node)
            {
                return node == _oldParameter ? _newParameter : base.VisitParameter(node);
            }
        }
    }
}