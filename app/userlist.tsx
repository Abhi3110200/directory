import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  useColorScheme,
} from "react-native";
import axios from "axios";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import RBSheet from "react-native-raw-bottom-sheet";

const userlist = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
  const navigation = useNavigation();
  const route = useRoute();
  const bottomSheetRef = useRef(null);
  const [selectedOptions, setSelectedOptions] = useState({
    name: false,
    email: false,
  });

  const theme = useColorScheme();

  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "User Directory",
      headerTitleAlign: "center",
      headerStyle:{
        color: `${theme === 'dark' ? 'white' : 'black'}`
      },
      headerShadowVisible: false,
      headerRight: () => (
        <TouchableOpacity onPress={() => bottomSheetRef.current?.open()}>
          <Feather name="filter" size={20} color={theme === "dark" ? "#fff" : "#000"} />
          {badgeCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, badgeCount]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=10`
      );
      setUsers((prevUsers) => [...prevUsers, ...response.data]);
      setFilteredUsers((prevUsers) => [...prevUsers, ...response.data]);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const sortUsers = (key) => {
    const sortedUsers = [...users].sort((a, b) => {
      // Convert both values to lowercase for case-insensitive comparison
      const valueA = a[key].toLowerCase();
      const valueB = b[key].toLowerCase();

      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });
    setFilteredUsers(sortedUsers);
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.userItem}
      onPress={() => navigation.navigate("userdetail", { user: item })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Image
          source={require("../assets/images/profile.jpg")}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
          }}
        />
        <View>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleCheckboxToggle = (key) => {
    setSelectedOptions((prev) => {
      const newValue = !prev[key];
      const newCount = newValue ? badgeCount + 1 : badgeCount - 1;
      setBadgeCount(newCount);
      return { ...prev, [key]: newValue };
    });
  };

  const handleDone = () => {
    const { name, email } = selectedOptions;

    if (name && email) {
      Alert.alert("Invalid Selection", "Please select only one option.");
      return;
    }

    if (!name && !email) {
      Alert.alert("Incomplete", "Please select at least one sorting option.");
      return;
    }

    if (name) sortUsers("name");
    if (email) sortUsers("email");

    bottomSheetRef.current?.close();
  };

  // Function to filter users by name based on search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredUsers(users); // Reset filtered users if query is empty
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  // Function to clear the search input
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredUsers(users); // Reset filtered users
  };

  if (loading && users.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* TextInput for search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {/* Cancel button to clear input */}
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={{
            position: 'absolute',
            right:10,
          }}>
            <Feather name='x' size={24} color={'black'}/>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredUsers}
        showsVerticalScrollIndicator={false}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{
          paddingBottom: 80,
          marginTop: 10,
        }}
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" color="#0000ff" /> : null
        }
      />

      <RBSheet
        ref={bottomSheetRef}
        height={250}
        openDuration={250}
        customStyles={{
          container: {
            padding: 16,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetText}>Filter Options</Text>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => handleCheckboxToggle("name")}
          >
            <View style={styles.checkbox}>
              {selectedOptions.name && (
                <Feather name="check" size={18} color="black" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Sort by Name</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => handleCheckboxToggle("email")}
          >
            <View style={styles.checkbox}>
              {selectedOptions.email && (
                <Feather name="check" size={18} color="black" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Sort by Email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleDone}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F0F0FF",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 10,
  },
  searchInput: {
    height: 50,
    flex: 1,
    paddingLeft: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    borderColor: "#ddd",
  },
  userItem: {
    paddingHorizontal: 16,
    marginHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  sheetContent: {
    paddingVertical: 20,
  },
  sheetText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: "#0C7FDDFF",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop:30,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default userlist;
