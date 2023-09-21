import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  LayoutAnimation,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles";

interface ExpandableButtonProps {
  gap?: number;
  title: string;
  children: React.ReactNode;
}

export default function ShowMore({
  gap,
  title,
  children,
}: ExpandableButtonProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  }, [expanded]);

  const { childrenTouchable, titleStyle, list } = useMemo(
    () => ({
      childrenTouchable: [
        styles.justifyContent_spaceBetween,
        styles.alignItems_center,
        styles.flexDirection_row,
      ],
      titleStyle: [styles.fontSize_12, styles.bold],
      list: [styles.marginTop_10, { gap: gap || 0 }],
    }),
    [gap]
  );

  const listItems = useMemo(
    () => expanded && <View style={list}>{children}</View>,
    [expanded, children, gap]
  );
  return (
    <View style={styles.fullWidth}>
      <TouchableWithoutFeedback onPress={toggleExpanded}>
        <View style={childrenTouchable}>
          <Text style={titleStyle}>{title}</Text>
          <View style={styles.marginR_5}>
            <MaterialIcons
              name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={20}
              color="black"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      {listItems}
    </View>
  );
}
