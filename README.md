# Blog API

**Built with NestJS + TypeScript**

This is a RESTful blog API backend built using NestJS and TypeScript. It provides a robust structure with modules for authentication and post management.
</br></br>Swagger docs (before first visit **wait ~1 minute** for the app to deploy):  
**https://nestjs-blog-api-5tf5.onrender.com/api**


## Features

- User registration and login with JWT-based authentication  
- Role-based access structure (secure endpoints)  
- CRUD operations for blog posts  
- User and post data validation using DTOs  
- Swagger documentation for easy API testing  

## Entities

- `User`: represents registered users of the blog  
- `Post`: represents blog posts created by users  

## Authentication

Authentication is handled using JWT tokens. Users must log in to receive a token which is required to access protected routes (like creating or editing posts). Passwords are securely hashed and validated.

## API Documentation

You can access the interactive Swagger documentation to test and explore all endpoints here:  
**https://nestjs-blog-api-5tf5.onrender.com/api**
