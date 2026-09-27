import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export function RoastHeader() {
    const theme = useTheme();

    const handleToggleTheme = () => {
        if (Platform.OS !== "web") {
            try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch {
                // Fallback
            }
        }
        theme.toggleTheme();
    };

    return (
        <View style={styles.headerContainer}>
            <View style={styles.topRow}>
                <View style={styles.brandRow}>
                    <Image
                        source={require("@/assets/images/flame-badge.png")}
                        style={styles.logoImage}
                        contentFit="contain"
                    />
                    <View>
                        <ThemedText type="title" style={styles.titleText}>
                            Roasmi AI
                        </ThemedText>
                    </View>
                </View>

                {/* Theme Toggle Button */}
                <Pressable
                    onPress={handleToggleTheme}
                    style={({ pressed }) => [
                        styles.themeButton,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.cardBorder,
                        },
                        pressed && styles.pressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Switch to ${theme.isDark ? "light" : "dark"} mode`}
                >
                    <ThemedText style={styles.themeIcon}>
                        {theme.isDark ? "☀️" : "🌙"}
                    </ThemedText>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: Spacing.one,
        marginBottom: Spacing.one,
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    brandRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.two,
    },
    logoImage: {
        width: 40,
        height: 40,
        borderRadius: 10,
    },
    titleText: {
        fontSize: 22,
        letterSpacing: -0.5,
    },
    themeButton: {
        width: 38,
        height: 38,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    themeIcon: {
        fontSize: 16,
    },
    pressed: {
        opacity: 0.7,
    },
});
