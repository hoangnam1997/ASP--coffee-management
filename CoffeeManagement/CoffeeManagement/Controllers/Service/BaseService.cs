using CoffeeManagement.Controllers.Repository;
using System.Collections.Generic;
using System.Linq;

namespace CoffeeManagement.Controllers.Service
{
    public class BaseService<T>: IBaseService<T> where T: class
    {
        protected IBaseRepository<T> _baseRepo;
        public BaseService(IBaseRepository<T> baseRepo)
        {
            _baseRepo = baseRepo;
        }
        
        public BaseService()
        {
            _baseRepo = new BaseRepository<T>();
        }

        public virtual IEnumerable<T> GetAll()
        {
            return _baseRepo.GetAll();
        }

        public T SelectById(object id)
        {
            try
            {
                return _baseRepo.SelectById(id);
            }
            catch
            {
                return null;
            }
        }

        public virtual void Insert(T obj)
        {
            _baseRepo.Insert(obj);
        }

        public virtual void Update(T obj)
        {
            _baseRepo.Update(obj);
        }

        public virtual void Delete(object id)
        {
            _baseRepo.Delete(id);
        }

        public void Save()
        {
            _baseRepo.Save();
        }
    }
}