import React, { useCallback, useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  LayoutAnimation,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import styles from "../styles";

import type { ChangeEvent } from "react";

type option = {
  value: string;
  label: string;
  status: string;
};

type SelectType = {
  defaultValue?: option;
  options: Array<option>;
  error?: string;
  label: string;
  placeholder?: string;
  onChange?: (e: string | ChangeEvent<any>) => void;
  onBlur?: (e: any) => void;
};

export default function Select({
  options,
  label,
  defaultValue,
  error,
  placeholder = "Selecione uma opção",
  onChange,
  onBlur,
}: SelectType) {
  const [expanded, setExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState<option | null>(
    defaultValue ? defaultValue : null
  );
  const optionFistValue = options?.[0]?.value;
  const optionLength = options?.length;

  useEffect(() => {
    if (onChange) {
      onChange(defaultValue?.value ? defaultValue?.value : "");
    }
  }, []);

  const handleOptionPress = useCallback(
    (option: option) => {
      setSelectedOption(option);
      setExpanded(false);
      onChange ? onChange(option?.value) : null;
    },
    [onChange, selectedOption?.value]
  );

  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  }, [expanded]);

  const renderTouchable = useCallback(
    (option: option) => (
      <TouchableWithoutFeedback
        key={option.value}
        onPress={() => handleOptionPress(option)}
        style={styles.padding_10}
      >
        <View style={[styles.padding_10, styles.borderColor_d8e1ef]}>
          <Text>{option.label}</Text>
        </View>
      </TouchableWithoutFeedback>
    ),
    [expanded]
  );

  const {
    container,
    containerTouchable,
    childrenButton,
    text,
    containerList,
    errorStyle,
  } = useMemo(
    () => ({
      container: [styles.position_relative, styles.fullWidth],
      containerTouchable: [
        styles.titleInputContainer,
        styles.position_absolute,
        styles.bgColor_white,
      ],
      childrenButton: [
        styles.padding_10,
        styles.borderRadius_3,
        styles.borderWidth_1,
        styles.alignItems_center,
        styles.justifyContent_spaceBetween,
        styles.fullWidth,
        styles.flexDirection_row,
        {
          borderColor: expanded && optionFistValue ? "#31b5f3" : "#d8e1ef",
        },
      ],
      text: { color: selectedOption?.value ? "black" : "#d8e1ef" },
      containerList: [
        styles.overflow_hidden,
        {
          height: expanded && optionFistValue ? optionLength * 40 : 0,
        },
      ],
      errorStyle: [styles.color_red, styles.fontSize_10],
    }),
    [expanded, optionFistValue, selectedOption?.value]
  );

  const { listTouchable, iconArrow } = useMemo(() => {
    const listTouchable = optionFistValue ? options.map(renderTouchable) : "";

    const iconArrow = optionFistValue ? (
      <MaterialIcons
        name={expanded ? "arrow-drop-up" : "arrow-drop-down"}
        size={24}
        color="black"
      />
    ) : null;

    return { listTouchable, iconArrow };
  }, [expanded, optionFistValue]);

  const elementError = useMemo(
    () =>
      error ? (
        <View>
          <Text style={errorStyle}>{error}</Text>
        </View>
      ) : null,
    [error]
  );

  const placeholderLabel = useMemo(
    () => (selectedOption ? selectedOption?.label : null),
    [selectedOption, selectedOption?.label]
  );

  return (
    <View style={container}>
      <View style={containerTouchable}>
        <Text style={styles.fontSize_10}>{label}</Text>
      </View>
      <TouchableWithoutFeedback onPress={toggleExpanded}>
        <View style={childrenButton}>
          <Text style={text}>{placeholderLabel}</Text>
          {iconArrow}
        </View>
      </TouchableWithoutFeedback>

      <View style={containerList}>{listTouchable}</View>
      <TextInput
        editable={false}
        value={selectedOption?.value}
        placeholder={placeholder}
        onBlur={onBlur}
        style={styles.display_none}
      />
      {elementError}
    </View>
  );
}
