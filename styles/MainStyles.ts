import { StyleSheet } from "react-native";

const createStyles = (theme: any, insets: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      position: "relative",
      backgroundColor: theme.colors.background,
    },
    calendarContainer: {
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.onSurface,
    },
    dateItem: {
      width: 60,
      height: 80,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 5,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
    },
    todayDateItem: {
      backgroundColor: theme.colors.onPrimary,
    },
    dayText: {
      fontSize: 14,
      fontFamily: "Poppins",
      color: theme.colors.primary,
    },
    dateText: {
      fontSize: 18,
      fontFamily: "PoppinsBold",
      color: theme.colors.primary,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    habitsContainer: {
      padding: 20,
      width: "80%",
      alignSelf: "center",
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: "PoppinsBold",
      marginBottom: 15,
      color: theme.colors.onBackground,
      width: "80%",
      alignSelf: "center",
    },
    listContainer: {
      paddingBottom: 100, // Ensure there's space for the FAB
    },
    headerContainer: {
      paddingBottom: 10,
    },
    fab: {
      position: "absolute",
      right: 16,
      backgroundColor: theme.colors.primary,
      zIndex: 10,
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });

export default createStyles;
