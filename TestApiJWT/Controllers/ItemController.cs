using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using VueCURD.Models;

namespace VueCURD.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IWebHostEnvironment _env;

        public ItemController(ApplicationDbContext dbContext, IWebHostEnvironment env)
        {
            this._dbContext = dbContext;
            _env = env;

        }

        [Authorize]
        [HttpGet]
        public JsonResult Get()
        {
            var Items = _dbContext.Item.ToList();

            return new JsonResult(Items);
        }

        [Authorize]
        [HttpPost]
        public JsonResult Post(Item item)
        {
            var result = _dbContext.Item.Add(item);
            _dbContext.SaveChanges();
            var Items = _dbContext.Item.ToList();

            return new JsonResult("Added Successfully");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public JsonResult Put(Item item)
        {
            var Item = _dbContext.Item.Where(x => x.ItemId == item.ItemId).FirstOrDefault();
            Item.Title = item.Title;
            Item.Description = item.Description;
            Item.PhotoFileName = item.PhotoFileName;
            _dbContext.SaveChanges();
            var Items = _dbContext.Item.ToList();

            return new JsonResult("Updated Successfully");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            var Item = _dbContext.Item.Where(x => x.ItemId == id).FirstOrDefault();
            _dbContext.Item.Remove(Item);
            _dbContext.SaveChanges();
            var Items = _dbContext.Item.ToList();

            return new JsonResult("Deleted Successfully");
        }

        [Route("SaveFile")]
        [HttpPost]
        public JsonResult SaveFile()
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                string filename = postedFile.FileName;
                var physicalPath = _env.ContentRootPath + "/Photos/" + filename;

                using (var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    postedFile.CopyTo(stream);
                }

                return new JsonResult(filename);
            }
            catch (Exception)
            {

                return new JsonResult("anonymous.png");
            }
        }

    }
}
