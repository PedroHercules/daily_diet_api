# Diet control API

This project is an API for diet control. The user can register a meal of the day, and indicate whether the meal is part of the diet or not.

#

## Endpoints

### User endpoints
 `POST` /user
> Register a new user
>
> Parameters: None
>
> Authorization: None

#### Body
```json
  {
    "name": "Pedro Hercules",
    "email": "pedro@example.com",
    "password": "password123@",
    "height_cm": 172,
    "weight_cm": 101,
    "target_weight_kg": 75,
  }
```

#### Response
> Status 201 - Created
```json
  {
    "user": {
      "name": "Pedro Hercules",
      "email": "pedro@example.com",
      "height_cm": 172,
      "weight_cm": 101,
      "target_weight_kg": 75,
      "created_at": "2023-04-04T17:44:33.380-03:00",
      "updated_at": "2023-04-04T17:44:33.380-03:00"
    },
    "token": {
      "token": "token JWT",
      "expires_at": "2023-04-04T17:44:33.380-03:00",
      "type": "bearer"
    }
  }
```

> Status 400 - Bad request
```json
  {
    // Ex: Invalid e-mail, invalid password, etc.
    "message": "Message error",
  }
```

> Status 500 - Internal server error
```json
  {
    // Ex: Error on database, server is not running, etc.
    "message": "Message error",
  }
```

`POST` /user/login
> Login user on api
>
> Parameters: None
>
> Authorization: None

#### Body
```json
  {
    "email": "pedro@example.com",
    "password": "password123@",
  }
```

#### Response
> Status 200 - Ok
```json
  {
    "user": {
      "name": "Pedro Hercules",
      "email": "pedro@example.com",
      "height_cm": 172,
      "weight_cm": 101,
      "target_weight_kg": 75,
      "created_at": "2023-04-04T17:44:33.380-03:00",
      "updated_at": "2023-04-04T17:44:33.380-03:00"
    },
    "token": {
      "token": "token JWT",
      "expires_at": "2023-04-04T17:44:33.380-03:00",
      "type": "bearer"
    }
  }
```

> Status 400 - Bad request
```json
  {
    // Ex: Invalid e-mail, invalid password, etc.
    "message": "Message error",
  }
```

> Status 404 - Not found
```json
  {
    "message": "User nor found",
  }
```

> Status 500 - Internal server error
```json
  {
    // Ex: Error on database, server is not running, etc.
    "message": "Message error",
  }
```

`GET` /user
> Return user info
>
> Parameters: None
>
> Authorization: Yes

#### Response
> Status 200 - Ok
```json
  {
    "user": {
      "name": "Pedro Hercules",
      "email": "pedro@example.com",
      "height_cm": 172,
      "weight_cm": 101,
      "target_weight_kg": 75,
      "created_at": "2023-04-04T17:44:33.380-03:00",
      "updated_at": "2023-04-04T17:44:33.380-03:00"
    }
  }
```

> Status 401 - Bad request
```json
  {
    "message": "Unauthorized",
  }
```

> Status 404 - Not found
```json
  {
    "message": "User nor found",
  }
```

> Status 500 - Internal server error
```json
  {
    // Ex: Error on database, server is not running, etc.
    "message": "Message error",
  }
```

`PUT` /user
> Update user info
>
> Parameters: None
>
> Authorization: Yes

#### Body
```json
  {
    "name": "Pedro Hercules",
    "email": "pedro@example.com",
    "password": "password123@",
    "height_cm": 172,
    "weight_cm": 101,
    "target_weight_kg": 75,
  }
```

#### Response
> Status 200 - Ok
```json
  {
    "user": {
      "name": "Pedro Hercules",
      "email": "pedro@example.com",
      "height_cm": 172,
      "weight_cm": 101,
      "target_weight_kg": 75,
      "created_at": "2023-04-04T17:44:33.380-03:00",
      "updated_at": "2023-04-04T17:44:33.380-03:00"
    }
  }
```

> Status 400 - Bad request
```json
  {
    // Ex: Invalid e-mail, invalid password, etc.
    "message": "Message error",
  }
```

> Status 401 - Bad request
```json
  {
    "message": "Unauthorized",
  }
```

> Status 500 - Internal server error
```json
  {
    // Ex: Error on database, server is not running, etc.
    "message": "Message error",
  }
```

#

### Meal endpoints
`POST` /meal
> Register a new meal
>
> Parameters: None
>
> Authorization: Yes

#### Body
```json
  {
    "name": "Pizza",
    "description": "Pizza made with oatmeal with eggs, chicken and cheese stuffing.",
    "meal_date": "30/04/2023",
    "meal_time": "21:00",
    "is_on_diet": true
  }
```

#### Response
> Status 201 - Created
```json
  {
    "meal": {
      "name": "Pizza",
      "description": "Pizza made with oatmeal with eggs, chicken and cheese stuffing.",
      "meal_date": "30/04/2023",
      "meal_time": "21:00",
      "is_on_diet": true,
      "created_at": "2023-04-30T21:24:33.380-03:00",
      "updated_at": "2023-04-30T21:24:33.380-03:00"
    },
  }
```

> Status 400 - Bad request
```json
  {
    // Ex: Invalid name, invalid description, etc.
    "message": "Message error",
  }
```

> Status 401 - Unauthorized
```json
  {
    "message": "Not authorized",
  }
```

> Status 500 - Internal server error
```json
  {
    // Ex: Error on database, server is not running, etc.
    "message": "Message error",
  }
```

`GET` /meal/list
> List all users meals
>
> Parameters: None
>
> Authorization: Yes


#### Response
> Status 200 - Ok
```json
  {
    "meals": [
      {
        "name": "Pizza",
        "description": "Pizza made with oatmeal with eggs, chicken and cheese stuffing.",
        "meal_date": "30/04/2023",
        "meal_time": "21:00",
        "is_on_diet": true,
        "created_at": "2023-04-30T21:24:33.380-03:00",
        "updated_at": "2023-04-30T21:24:33.380-03:00"
      },
      {
        "name": "Hamburger",
        "description": "Hamburger with wholegrain bread, lean meat and vegetables.",
        "meal_date": "30/04/2023",
        "meal_time": "18:00",
        "is_on_diet": true,
        "created_at": "2023-04-30T21:24:33.380-03:00",
        "updated_at": "2023-04-30T21:24:33.380-03:00"
      }
    ]
  }
```


> Status 401 - Unauthorized
```json
  {
    "message": "Not authorized",
  }
```

> Status 500 - Internal server error
```json
  {
    // Ex: Error on database, server is not running, etc.
    "message": "Message error",
  }
```

`GET` /meal/:mealId
> Get a specific meal by ID
>
> Parameters: Yes
>
> Authorization: Yes


#### Response
> Status 200 - Ok
```json
  {
    "meal":
      {
        "name": "Pizza",
        "description": "Pizza made with oatmeal with eggs, chicken and cheese stuffing.",
        "meal_date": "30/04/2023",
        "meal_time": "21:00",
        "is_on_diet": true,
        "created_at": "2023-04-30T21:24:33.380-03:00",
        "updated_at": "2023-04-30T21:24:33.380-03:00"
      }
  }
```

> Status 400 - Bad request
```json
  {
    "message": "Invalid meal ID",
  }
```

> Status 401 - Unauthorized
```json
  {
    "message": "Not authorized",
  }
```

> Status 404 - Not found
```json
  {
    "message": "Meal not found",
  }
```

> Status 500 - Internal server error
```json
  {
    // Ex: Error on database, server is not running, etc.
    "message": "Message error",
  }
```

`PUT` /meal/:mealId
> Update meal info
>
> Parameters: Yes
>
> Authorization: Yes

#### Body
```json
  {
    "name": "Pizza",
    "description": "Pizza made with oatmeal with eggs, chicken and cheese stuffing.",
    "meal_date": "30/04/2023",
    "meal_time": "21:00",
    "is_on_diet": true
  }
```

#### Response
> Status 200 - Ok
```json
  {
    "meal": {
      "name": "Pizza",
      "description": "Pizza made with oatmeal with eggs, chicken and cheese stuffing.",
      "meal_date": "30/04/2023",
      "meal_time": "21:00",
      "is_on_diet": true,
      "created_at": "2023-04-30T21:24:33.380-03:00",
      "updated_at": "2023-04-30T21:24:33.380-03:00"
    },
  }
```

> Status 400 - Bad request
```json
  {
    // Ex: Invalid name, invalid description, etc.
    "message": "Message error",
  }
```

> Status 401 - Unauthorized
```json
  {
    "message": "Not authorized",
  }
```

> Status 404 - Not found
```json
  {
    "message": "Meal not found",
  }
```

> Status 500 - Internal server error
```json
  {
    // Ex: Error on database, server is not running, etc.
    "message": "Message error",
  }
```

`DELETE` /meal/:mealId
> Delete a specific meal by ID
>
> Parameters: Yes
>
> Authorization: Yes


#### Response
> Status 200 - Ok
```json
  {
    "message": "Meal removed succesfully"
  }
```

> Status 400 - UBad request
```json
  {
    "message": "Invalid meal ID",
  }
```

> Status 401 - Unauthorized
```json
  {
    "message": "Not authorized",
  }
```

> Status 404 - Not found
```json
  {
    "message": "Meal not found",
  }
```

> Status 500 - Internal server error
```json
  {
    // Ex: Error on database, server is not running, etc.
    "message": "Message error",
  }
```

`GET` /meal/metrics
> Return all user meal metrics
>
> Parameters: None
>
> Authorization: Yes


#### Response
> Status 200 - Ok
```json
  {
    "metrics":
      {
        "total_meals": 20,
        "meals_on_diet": 15,
        "meals_out_diet": 5,
        "best_sequence_days_meal": 4
      }
  }
```

> Status 401 - Unauthorized
```json
  {
    "message": "Not authorized",
  }
```

> Status 500 - Internal server error
```json
  {
    // Ex: Error on database, server is not running, etc.
    "message": "Message error",
  }
```