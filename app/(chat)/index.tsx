import { Button, FlatList, View } from "react-native";
import { Text } from "@/components/Text";
import { Link, useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { database, appwriteConfig } from "@/utils/appwrite";
import { useState, useEffect } from "react";
import { ChatRoom } from "@/utils/types";

export default function Index() {
  const router = useRouter();

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const { documents, total } = await database.listDocuments(
        appwriteConfig.db,
        appwriteConfig.col.chatRooms
      );

      console.log("total", total);

      console.log("docs", JSON.stringify(documents, null, 2));

      // Map the Document objects to ChatRoom objects
      const rooms = documents.map((doc) => ({
        id: doc.$id,
        title: doc.title,
        description: doc.description,
        isPrivate: doc.isPrivate,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
      }));

      setChatRooms(rooms);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FlatList
      data={chatRooms}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        return (
          <Link
            href={{
              pathname: "/[chat]",
              params: { chat: item.id },
            }}
          >
            <View
              style={{
                gap: 6,
                padding: 16,
                width: "100%",
                borderRadius: 16,
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: "#262626",
                justifyContent: "space-between",
              }}
            >
              <ItemTitleAndDescription
                title={item.title}
                description={item.description}
                isPrivate={item.isPrivate}
              />
              <IconSymbol name="chevron.right" size={20} color="#666666" />
            </View>
          </Link>
        );
      }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 16,
        gap: 16,
      }}
    />
  );
}

function ItemTitle({
  title,
  isPrivate,
}: {
  title: string;
  isPrivate: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <Text style={{ fontSize: 17 }}>{title}</Text>
      {isPrivate && <IconSymbol name="lock.fill" size={20} color="#666666" />}
    </View>
  );
}

function ItemTitleAndDescription({
  title,
  description,
  isPrivate,
}: {
  title: string;
  description: string;
  isPrivate: boolean;
}) {
  return (
    <View style={{ gap: 4 }}>
      <ItemTitle title={title} isPrivate={isPrivate} />
      <Text style={{ fontSize: 13, color: "#666666" }}>{description}</Text>
    </View>
  );
}
