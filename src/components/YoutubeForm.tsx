import { useForm, useFieldArray } from "react-hook-form";
//useFieldArray is used for handling Dynamic Form Fields

import { DevTool } from '@hookform/devtools';
import { useEffect } from "react";

type FormValues = {
  username: string
  email: string
  channel: string
  //Input Fields as Nested Objects
  social: {
    twitter: string
    facebook: string
  }
  //Input Fields as Arrays of String
  phoneNumbers: string[];

  //Input Fields as Array of Objects (useFieldArray Example)
  phNumbers: {
    number: string;
  }[];
  
  //How to deal with numeric and date values
  age: number;
  dob: Date;
}

const YoutubeForm = () => {
  const form = useForm<FormValues>({
    defaultValues : {
      username: "",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: ""
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: '' }],
      age: 0,
      dob: new Date(),
    }
    // Setting default values by fetching data from an API
    /*
      defaultValues: async () => {
        const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
        const data = await response.json();
        return {
          username: data.name,
          email: data.email,
          channel: ""
        }
      }
    */
    
  });
  const { register, control, handleSubmit, watch, formState } = form;
  const { errors } = formState;

  //useFieldArray returns an array of fields which we can render in the JSX
  const { fields, append, remove } = useFieldArray({
    name: 'phNumbers',
    control: control
  })

  console.log(errors);

  //const {name, ref, onChange, onBlur} = register("username"); 

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted", data);
  }

  /************** Watching Field Values Starts *******************/
  const watchUsername = watch('username');
  //const watchMultiple = watch(['username', 'email']);
  //const watchEntireForm = watch();

  /*
  When we start typing into the form fields, watch() continuously observes the form fields
  values and updates the UI.Because of this the component re-renders everytime the watched value changes. This is fine for the small projects like this.

  On the other hand, we can perform a side effect after watching a value, the we can use the "callback version of the watch method". It will prevent the re-rendering on changing field values. 
  
  */

  useEffect(() => {
    //the function receives the updated value as argument
    const subscription = watch((updatedFieldValue) => {
      console.log(updatedFieldValue);
    })

    return () => subscription.unsubscribe();
  }, [watch])

  /******************Watching Field Values Ends*********************/
  

  
  return (
    <div className="form-container">
        <h1><span className="heading-text-1">React</span> <span className="heading-text-2">Hook</span> <span className="heading-text-3">Form</span> <span className="heading-text-4">Tutorial</span></h1>
        <h2>Watched Value: {watchUsername}</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            
            {/* Username Field Starts */}
            <div className="form-control">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                {...register("username", {
                  required: {
                    value: true,
                    message: "Username is required"
                  }
                })} 
              />
              <p className="error">{errors.username?.message}</p>
            </div>
            {/* Username Field Ends */}

            {/* Email Field Starts */}
            <div className="form-control">
              <label htmlFor="email">E-mail</label>
              <input 
                type="email" 
                id="email" 
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required"
                  },
                  //HTML Validations
                  pattern: {
                    value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    message: "Invalid email format"
                  },
                  //Custom Validations 
                  //This validate function automatically receives fieldValue
                  /*
                    validate: (fieldValue) => {
                      return (
                        fieldValue !== 'admin@example.com' || 'Enter a different email address'
                      ); 
                    }
                  */ 

                  // validate can also be written as an object in which each key is the name of a validation rule
                  validate: {
                    notAdmin: (fieldValue) => {
                      return (
                        fieldValue !== 'admin@example.com' || 'Enter a different email address'
                      ); 
                    },
                    notBlacklisted: (fieldValue) => {
                      return (
                        !fieldValue.endsWith("baddomain.com") || 'This domain is not supported'
                      )
                    } 
                  }
                })}
              />
              <p className="error">{errors.email?.message}</p>
            </div>
            {/* Email Field Ends */}

            {/* Channel Field Starts */}
            <div className="form-control">
              <label htmlFor="channel">Channel</label>
              <input 
                type="text" 
                id="channel" 
                {...register("channel", {
                  required: {
                    value: true,
                    message: "Channel is required"
                  }
                })}
              />
              <p className="error">{errors.channel?.message}</p>
            </div>
            {/* Channel Field Ends */}

            {/* Input Fields as Nested Objects Starts */}
            <fieldset>
              <legend>Social Media</legend>
              {/* Twitter Field Starts */}
              <div className="form-control">
                <label htmlFor="twitter">Twitter</label>
                <input 
                  type="text" 
                  id="twitter" 
                  {...register("social.twitter", {
                    required: {
                      value: true,
                      message: "You must add a Twitter Account"
                    }
                  })}
                />
                <p className="error">{errors.social?.twitter?.message}</p>
              </div>
              {/* Twitter Field Ends */}

              {/* Facebook Field Starts */}
              <div className="form-control">
                <label htmlFor="facebook">Facebook</label>
                <input 
                  type="text" 
                  id="facebook" 
                  {...register("social.facebook", {
                    required: {
                      value: true,
                      message: "You must add a Facebook Account"
                    }
                  })}
                />
                <p className="error">{errors.social?.facebook?.message}</p>
              </div>
              {/* Facebook Field Ends */}
            </fieldset>      
            {/* Input Fields as Nested Objects Ends */}

            {/* Input Fields as Array Starts */}
            <div className="form-control">
              <label htmlFor="primary-phone">Primary Phone Number</label>
              <input 
                type="text" 
                id="primary-phone" 
                {...register("phoneNumbers.0", {
                  required: {
                    value: true,
                    message: "Primary phone number is required"
                  }
                })}
              />
              <p className="error">{errors.phoneNumbers?.[0]?.message}</p>
            </div>

            <div className="form-control">
              <label htmlFor="secondary-phone">Secondary Phone Number</label>
              <input 
                type="text" 
                id="secondary-phone" 
                {...register("phoneNumbers.1", {
                  required: {
                    value: true,
                    message: "Secondary phone number is required"
                  }
                })}
              />
              <p className="error">{errors.phoneNumbers?.[1]?.message}</p>
            </div>
            {/* Input Fields as Array Ends */}

            {/* useFieldArray Example Starts */}
            <div>
                <label>List of Phone Numbers</label>
                <div>
                  {
                    fields.map((field, index) => {
                      return (
                        <div className="form-control" key={field.id}>
                          <input 
                            type="text"
                            {...register(`phNumbers.${index}.number` as const)}
                          />
                          {
                            index > 0 && (
                              <button 
                                type="button" 
                                onClick={() => remove(index)}
                              >
                                Remove
                              </button>
                            )
                          }
                        </div>
                      )
                    })
                  }
                  <button 
                    type="button" 
                    onClick={() => append({ number: "" })}
                  >
                    Add Phone Number
                  </button>
                </div>
            </div>
            {/* useFieldArray Example Ends */}

            {/* Numeric Input Example Starts */}
            <div className="form-control">
              <label htmlFor="age">age</label>
              <input 
                type="number" 
                id="age" 
                {...register("age", {
                  valueAsNumber: true, //to get number as number not string
                  required: {
                    value: true,
                    message: "Age is required"
                  }
                })}
              />
              <p className="error">{errors.age?.message}</p>
            </div>
            {/* Numeric Input Example Ends */}

            {/* Date Input Example Starts */}
            <div className="form-control">
              <label htmlFor="dob">Date of birth</label>
              <input 
                type="date" 
                id="dob" 
                {...register("dob", {
                  valueAsDate: true, //to get date as date type value not string
                  required: {
                    value: true,
                    message: "DOB is required"
                  }
                })}
              />
              <p className="error">{errors.dob?.message}</p>
            </div>
            {/* Date Input Example Ends */}

            <button>Submit</button>
        </form>
        <DevTool control={control}/> {/* tying together YoutubeForm with Devtools */}
    </div>
  )
}

export default YoutubeForm;

/* 
1. useForm hook is the primary tool that the react-hook-form library provides
to manage the forms with ease. 

2. useForm hook returns an object that contains several useful properties and
methods that can be used with forms. 
*/

/*
  *******************Managing Form State*******************
  
  What is Form State?
  -------------------
  Every form has a few moving parts that keep changing from the time a
  user loads the form to the time they submit it.
  It includes:
  1. current value of every field in the form
  2. whether a field has been interacted with
  3. whether a field's value has changed
  4. whether the form in invalid
  5. whether a field contains errors
     and much more...
  
  All this data (metioned in above five points) can be collectively called
  as "Form State".

  In code, we can represent the form state as an object with key/value pairs:

    {
      values: {...}
      visited: {...}
      errors: {...}
      isValid: boolean
    }
  
  but trying to do this manually is time consuming and react-hook-form makes
  this process easier by providing register.

  To help manage form state react-hook-form provides a method called "register" that
  can be accessed on the form object.

  register method allows us to register a form control with react-hook-form.
    
*/