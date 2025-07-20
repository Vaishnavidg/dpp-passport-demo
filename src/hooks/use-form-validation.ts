/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateField = (name: string, value: any): string => {
    const rule = validationRules[name];
    if (!rule) return "";

    // Required validation
    if (
      rule.required &&
      (!value || (typeof value === "string" && value.trim() === ""))
    ) {
      return `${name} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return "";
    }

    // Min length validation
    if (
      rule.minLength &&
      typeof value === "string" &&
      value.length < rule.minLength
    ) {
      return `${name} must be at least ${rule.minLength} characters`;
    }

    // Max length validation
    if (
      rule.maxLength &&
      typeof value === "string" &&
      value.length > rule.maxLength
    ) {
      return `${name} must be no more than ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (
      rule.pattern &&
      typeof value === "string" &&
      !rule.pattern.test(value)
    ) {
      return `${name} format is invalid`;
    }

    // Custom validation
    if (rule.custom) {
      const result = rule.custom(value);
      if (typeof result === "string") {
        return result;
      }
      if (!result) {
        return `${name} is invalid`;
      }
    }

    return "";
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as string]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (name: keyof T) => {
    const error = validateField(name as string, values[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  const setFieldError = (name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const clearFieldError = (name: keyof T) => {
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const showValidationToast = (message: string) => {
    toast({
      title: "Validation Error",
      description: message,
      variant: "destructive",
    });
  };

  return {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFieldError,
    clearFieldError,
    showValidationToast,
  };
}
