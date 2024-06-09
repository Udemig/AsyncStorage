import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export default function App() {
  //* Inputun içerisindeki değer
  const [todo, setTodo] = useState('');
  //* Eklenilen todolar
  const [todos, setTodos] = useState([]);

  const saveTodos = async saveTodo => {
    console.log('savetodo', saveTodo);
    try {
      //* AsyncStorage ekleme yaparken setItem metodu ile ekleme yaparız.
      //* Bizden iki değer:
      //* 1.değer:Key(string)
      //* 2.değer:Value(string) Objeyi stringe çevirebilmek için JSON.stringfy methodunu kullanırız.
      await AsyncStorage.setItem('todos', JSON.stringify(saveTodo));
    } catch (error) {
      console.log('error', error);
    }
  };

  //* Add butonuna basıldığında çalışacak
  const addTodo = () => {
    //* Yeni bir todo objesi oluştur ve todos stateine aktar
    if (todo) {
      const updatedTodos = [...todos, {id: uuid.v4(), text: todo}];
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
    }
  };

  const loadTodos = async () => {
    // try {
    //   await AsyncStorage.removeItem('todos');
    // } catch (error) {
    //   console.log(error);
    // }
    try {
      /*
        * AsyncStorage dan veriyi alırken getItem metodu ile alırız.
        * getItem bizden key ister.
        * Veriyi string olarak getirir.

      */
      const storedData = await AsyncStorage.getItem('todos');
      console.log('storedData', storedData);
      if (storedData) {
        setTodos(JSON.parse(storedData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async id => {
    //* Bastığımız elemanın idsi ile dizi içerisindeki idlerden eşleşmeyenleri çıkar ve bize dizi olarak dönder
    const updatedTodo = todos?.filter(x => x.id !== id);
    console.log(updatedTodo);
    //* Statei güncelle
    setTodos(updatedTodo);
    //* AsyncStorega güncelle
    saveTodos(updatedTodo);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headerText}>React Native AsyncStorage</Text>
        <View style={styles.inputContainer}>
          <View style={styles.buttonContainer}>
            <TextInput
              onChangeText={text => setTodo(text)}
              placeholder="Type a Todo"
              style={styles.input}
            />
            <TouchableOpacity
              onPress={addTodo}
              style={[styles.button, styles.addButton]}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={todos}
          keyExtractor={item => item.id?.toString()}
          renderItem={({item}) => (
            <View style={styles.todoitem}>
              <Text style={{color: '#000000'}}>{item?.text}</Text>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => deleteTodo(item?.id)}
                    style={[styles.button, styles.deleteButton]}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.updateButton]}>
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    borderColor: 'gray',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {},
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    padding: 8,
  },
  buttonText: {
    color: '#fff',
  },
  todoitem: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updateButton: {backgroundColor: 'blue', padding: 10},
  deleteButton: {
    padding: 10,
  },
});
