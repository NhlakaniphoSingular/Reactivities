using Application.Activities;
using Application.Core;
using Application.interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,IConfiguration config)
        {

            // Add services to the container.

        
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
             services.AddDbContext<DataContext>(opt => {
             opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
              });
              services.AddCors(opt=>
              {
              opt.AddPolicy("CorsPolicy", policy=>{
              policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
               });
              }
              );
             services.AddMediatR(typeof(List.Handler));
              services.AddAutoMapper(typeof(MappingProfiles).Assembly);
              services.AddFluentValidationAutoValidation();
              services.AddValidatorsFromAssemblyContaining<Create>();
              services.AddHttpContextAccessor();
              services.AddScoped<IuserAccessor,UserAccessor>();
              services.AddScoped<IPhotoAccessor,PhotoAccessor>();
              services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
           
              return services;
        }
    }
}