import React, { useCallback, useState, useMemo } from "react";
import {
  View,
  TextInput as TextInputNative,
  Text,
  KeyboardTypeOptions,
} from "react-native";
import styles from "../styles";

import { useDebounce } from "../utils";

type InputTextType = {
  width?: string | number;
  value?: string | null | undefined;
  label?: string;
  onChange: (e: string | React.ChangeEvent<any>) => void;
  onBlur: (e: any) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  mask?: (e: string) => string | { error?: string } | undefined;
  error?: string;
};

export default function TextInput({
  mask,
  width,
  value,
  label,
  error,
  onChange,
  onBlur,
  placeholder,
  keyboardType = "default",
}: InputTextType) {
  const [currentValue, setCurrentValue] = useState(value);
  const [err, setError] = useState(error ? error : null);

  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback((value: string) => {
    const formattedValue = mask ? mask(value) : value;
    if (formattedValue?.error) {
      useDebounce(() => {
        setError(null);
      }, 200);
      return setError(formattedValue?.error);
    }
    formattedValue ? onChange(formattedValue) : null;
    setCurrentValue(formattedValue);
  }, []);

  const elementError = useMemo(
    () =>
      err || error ? (
        <View>
          <Text style={[styles.color_red, styles.fontSize_10]}>
            {err || error}
          </Text>
        </View>
      ) : null,
    [err, error]
  );

  const labelElement = useMemo(
    () => label && <Text style={styles.fontSize_10}>{label}</Text>,
    [label]
  );

  const { container, containerLabel, inputText } = useMemo(
    () => ({
      container: [styles.position_relative, { width: width || "100%" }],
      containerLabel: [
        styles.titleInputContainer,
        styles.position_absolute,
        styles.bgColor_white,
      ],
      inputText: [
        styles.padding_10,
        styles.borderRadius_3,
        styles.borderWidth_1,
        styles.fullWidth,
        { borderColor: isFocused ? "#31b5f3" : "#d8e1ef" },
      ],
    }),
    [width]
  );

  return (
    <View style={container}>
      <View style={containerLabel}>{labelElement}</View>

      <TextInputNative
        value={currentValue}
        onChangeText={handleChange}
        onBlur={(e) => {
          onBlur(e);
          setIsFocused(false);
        }}
        placeholder={placeholder}
        onFocus={() => {
          setIsFocused(true);
        }}
        keyboardType={keyboardType}
        style={inputText}
      />
      {elementError}
    </View>
  );
}
