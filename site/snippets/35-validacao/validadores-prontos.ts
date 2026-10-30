Validators.required        // { required: true }
Validators.min(1)          // { min: { min: 1, actual: 0 } }
Validators.max(365)        // { max: { max: 365, actual: 400 } }
Validators.minLength(3)    // { minlength: { requiredLength: 3, actualLength: 2 } }
Validators.maxLength(40)   // { maxlength: { requiredLength: 40, actualLength: 41 } }
Validators.pattern(regex)  // { pattern: { requiredPattern: '…', actualValue: '…' } }
Validators.email           // { email: true }
