using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VueCURD.Models;

namespace VueCURD
{
    public class DbContextSeedData
    {
        private ApplicationDbContext _context;

        public DbContextSeedData(ApplicationDbContext context)
        {
            _context = context;
        }

        public async void SeedUsers()
        {
            var user = new ApplicationUser
            {
                FirstName = "Admin",
                LastName = "Admin",
                UserName = "Admin@email.com",
                NormalizedUserName = "Admin@email.com",
                Email = "Admin@email.com",
                NormalizedEmail = "Admin@email.com",
                EmailConfirmed = true,
                LockoutEnabled = false,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var roleStore = new RoleStore<IdentityRole>(_context);

            if (!_context.Roles.Any(r => r.Name == "Admin"))
            {
                await roleStore.CreateAsync(new IdentityRole { Name = "Admin", NormalizedName = "Admin" });
            }

            if (!_context.Users.Any(u => u.UserName == user.UserName))
            {
                var password = new PasswordHasher<ApplicationUser>();
                var hashed = password.HashPassword(user, "Admin@123");
                user.PasswordHash = hashed;
                var userStore = new UserStore<ApplicationUser>(_context);
                await userStore.CreateAsync(user);
                await userStore.AddToRoleAsync(user, "Admin");
            }

            await _context.SaveChangesAsync();

            var user2 = new ApplicationUser
            {
                FirstName = "User",
                LastName = "User",
                UserName = "User@email.com",
                NormalizedUserName = "User@email.com",
                Email = "User@email.com",
                NormalizedEmail = "User@email.com",
                EmailConfirmed = true,
                LockoutEnabled = false,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var roleStore2 = new RoleStore<IdentityRole>(_context);

            if (!_context.Roles.Any(r => r.Name == "User"))
            {
                await roleStore2.CreateAsync(new IdentityRole { Name = "User", NormalizedName = "User" });
            }

            if (!_context.Users.Any(u => u.UserName == user.UserName))
            {
                var password = new PasswordHasher<ApplicationUser>();
                var hashed = password.HashPassword(user, "User@123");
                user.PasswordHash = hashed;
                var userStore = new UserStore<ApplicationUser>(_context);
                await userStore.CreateAsync(user);
                await userStore.AddToRoleAsync(user, "User");
            }

            await _context.SaveChangesAsync();
        }
        
    }
}
