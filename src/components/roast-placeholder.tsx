import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { BorderRadius, Spacing } from "@/constants/theme";

export function RoastPlaceholder() {
    return (
        <View style={[styles.container]}>
            <View style={styles.content}>
                <Image
                    source={require("@/assets/images/flame-badge.png")}
                    style={styles.flameIcon}
                    contentFit="contain"
                />
                <ThemedText type="subtitle" style={styles.title}>
                    Ready for feedback?
                </ThemedText>
                <ThemedText
                    type="default"
                    themeColor="textSecondary"
                    style={styles.description}
                >
                    Type your idea below and let RoasmiAI roast it for you!
                </ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: BorderRadius.lg,
        padding: Spacing.three,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 130,
    },
    content: {
        alignItems: "center",
        gap: Spacing.one,
        maxWidth: 380,
    },
    flameIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
    },
    title: {
        textAlign: "center",
        fontSize: 17,
        fontWeight: "700",
    },
    description: {
        textAlign: "center",
        fontSize: 13,
        lineHeight: 18,
    },
});
