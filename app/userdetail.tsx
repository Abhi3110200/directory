import { View, Text, Image, Linking, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";

const UserDetail = () => {
  const route = useRoute();
  const item = route.params;
  console.log(item?.user);
  const [loading, setLoading] = useState(true); 

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigation.setOptions({
          headerTitle: item?.user?.name,
          headerShadowVisible:false,
        });
        setLoading(false); // Stop loading after data is processed
      } catch (error) {
        console.error(error);
        setLoading(false); // Stop loading on error
      }
    };

    fetchData();
  }, [navigation, item?.user?.name]);

  const handleAddressPress = () => {
    const { lat, lng } = item?.user?.address?.geo;
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    Linking.openURL(googleMapsUrl);
  };

  if (loading) {
    // Display loading indicator while loading
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Image
          source={require("../assets/images/profile.jpg")}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth:2,
            borderColor: "#333",

          }}
        />
        <Text style={{
            marginTop:15,
            fontSize:22,
            fontWeight:"bold",
        }}>{item?.user?.username}</Text>
      </View>
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 20,
          flexDirection: "column",
          gap: 15,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Name:
          <Text
            style={{
              fontWeight: "400",
            }}
          >
            {" "}
            {item?.user?.name}
          </Text>
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Email:
          <Text
            style={{
              fontWeight: "400",
            }}
          >
            {" "}
            {item?.user?.email}
          </Text>
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Phone Number:
          <Text
            style={{
              fontWeight: "400",
            }}
          >
            {" "}
            {item?.user?.phone}
          </Text>
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Address:
          <Text
            style={{
              fontWeight: "400",
            }} onPress={handleAddressPress}
          >
            {" "}
            {item?.user?.address?.street}, {item?.user?.address?.city},{" "}
            {item?.user?.address?.zipcode}
          </Text>
        </Text>
        {/* <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Username:
          <Text
            style={{
              fontWeight: "400",
            }}
          >
            {" "}
            {item?.user?.username}
          </Text>
        </Text> */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Website:
          <Text
            style={{
              fontWeight: "400",
              color: "blue",
              textDecorationLine: "underline",
            }}
            onPress={() => Linking.openURL(`https://${item?.user?.website}`)}
          >
            {item?.user?.website}
          </Text>
        </Text>
      </View>
      <View
        style={{
          marginTop: 20,
          paddingHorizontal: 16,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          Company Details
        </Text>
        <View style={{
            flexDirection: 'column',
            gap:15,
            marginTop:10,
        }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Company Name:
            <Text
              style={{
                fontWeight: "400",
              }}
            >
              {" "}
              {item?.user?.company?.name}
            </Text>
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Bio:
            <Text
              style={{
                fontWeight: "400",
              }}
            >
              {" "}
              {item?.user?.company?.bs}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UserDetail;
