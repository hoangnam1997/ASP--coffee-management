using System.Collections.Generic;

namespace CoffeeManagement.Controllers.Repository
{
    public interface IBaseRepository<T> where T : class
    {
        IEnumerable<T> GetAll();
        T SelectById(object id);
        void Insert(T obj);
        void Update(T obj);
        void Delete(object id);
        void Save();
        
    }
}
