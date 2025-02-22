import { StyleSheet } from "react-native";
const createStyles = (theme: any) =>
  StyleSheet.create({
    divider: {
      width: "100%",
      opacity: 0.3,
      height: 1,
      backgroundColor: theme.colors.onPrimary,
      marginVertical: 10,
    },
    container: {
      paddingVertical: 40,
      alignItems: "center",
    },
    formContainer: {
      width: "100%",
      alignItems: "center",
    },
    title: {
      fontSize: 28,
      fontFamily: "PoppinsBold",
      textAlign: "center",
      marginBottom: 30,
    },
    input: {
      marginBottom: 20,
      backgroundColor: "transparent",
      width: "100%",
    },
    checkboxContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
    },
    checkboxItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    checkboxLabel: {
      marginLeft: 8,
    },
    radioButtonContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginBottom: 20,
    },
    button: {
      width: "100%",
      paddingVertical: 10,
      borderRadius: 8,
      marginBottom: 20,
    },
    logo: {
      width: 150,
      height: 150,
      marginBottom: 30,
    },
    buttonLabel: {
      fontSize: 18,
      fontFamily: "Poppins",
      color: "#fff",
    },
    link: {
      textDecorationLine: "none",
      color: "#fff",
    },
    signupContainer: {
      marginTop: 10,
    },
    signupLink: {
      textDecorationLine: "underline",
      fontWeight: "bold",
    },
    datePickerContainer: {
      display: "flex",
      justifyContent: "space-around",
      width: "110%",
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 10,
      paddingLeft: 0,
      marginBottom: 20,
      backgroundColor: theme.colors.primary,
    },
    timePickerContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 0,
      marginBottom: 20,
      backgroundColor: theme.colors.primary,
    },
    radioGroupContainer: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      backgroundColor: theme.colors.primary,
    },
    radioGroupLabel: {
      marginRight: 10,
      color: theme.colors.onPrimary,
      fontSize: 16,
    },
    radioButtonGroup: {
      flex: 1,
      alignItems: "flex-end",
    },
  });

export default createStyles;
