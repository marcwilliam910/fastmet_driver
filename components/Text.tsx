import {Text as RNText, TextProps} from "react-native";

export default function Text({className, style, ...props}: TextProps) {
  const fontFamily = className?.includes("font-bold")
    ? "Montserrat_700Bold"
    : "Montserrat_400Regular";

  return (
    <RNText className={className} style={[{fontFamily}, style]} {...props} />
  );
}
