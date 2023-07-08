import React from "react";

import { NumberFieldRenderer } from "../NumberFieldRenderer";
import {
  FormFieldFloat,
  FormFieldManager,
  FormFieldValueRendererProps,
  SpecificFormFieldRendererProps,
  TypeOfField,
} from "../types";

export class FloatFormFieldManager implements FormFieldManager<FormFieldFloat> {
  public type: TypeOfField<FormFieldFloat> = "float";

  public renderField: React.FC<SpecificFormFieldRendererProps<FormFieldFloat>> =
    (props) => <NumberFieldRenderer {...props} isFloat={true} />;

  public renderValue: React.FC<FormFieldValueRendererProps<FormFieldFloat>> = (
    props
  ) => <>{props.value}</>;
}
