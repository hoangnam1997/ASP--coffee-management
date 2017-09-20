﻿using CoffeeManagement.Models;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace CoffeeManagement.Controllers.Repository
{
    public class BaseRepository<T>: IBaseRepository<T> where T : class
    {
        protected GalaxyCoffeeEntities _db { get; set; }
        protected DbSet<T> _table = null;

        public BaseRepository()
        {
            _db = new GalaxyCoffeeEntities();
            _table = _db.Set<T>();
        }

        public BaseRepository(GalaxyCoffeeEntities db)
        {
            _db = db;
            _table = _db.Set<T>();
        }

        public IEnumerable<T> GetAll()
        {
            //return _table.AsNoTracking().ToList();
            return _table;
        }

        public T SelectById(object id)
        {
            try
            {
                return _table.Find(id);
            }
            catch
            {
                return null;
            }
        }

        public void Insert(T obj)
        {
            _table.Add(obj);
        }

        public void Update(T obj)
        {
            _table.Attach(obj);
            _db.Entry(obj).State = EntityState.Modified;
        }

        public void Delete(object id)
        {
            T existing = _table.Find(id);
            _table.Remove(existing);
        }

        public void Save()
        {
            _db.SaveChanges();
        }

    }
}