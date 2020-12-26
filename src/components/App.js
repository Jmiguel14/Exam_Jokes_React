import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Input, Row, Select, Skeleton, Table, Typography} from 'antd';
import '../styles/App.css';
import {VideoCameraOutlined, SearchOutlined} from '@ant-design/icons';

const {Option} = Select;
const {Title, Text} = Typography;

const App = () => {
    const [form] = Form.useForm();
    const [joke, setJoke] = useState('');
    const [changeJoke, setChangeJoke] = useState(false);
    const [jokeCategory, setJokeCategory] = useState([]);
    const [jokeByCategory, setJokeByCategory] = useState(null);
    const [keyWord, setKeyWord] = useState('');
    const [jokesByQuery, setJokesByQuery] = useState([]);
    const [changeJokeQuery, setChangeJokeQuery] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    //Efecto para setear todas las categorías de los chistes
    useEffect(() => {

        const getJokeCategory = async () => {
            const data = await fetch(`https://api.chucknorris.io/jokes/categories`)
            const jsonJokeCategory = await data.json();

            console.log('Categorías', jsonJokeCategory)
            setJokeCategory(jsonJokeCategory);
        };
        getJokeCategory();

    }, []);

    //Efecto para buscar los chistes con o sin categoría
    //Este efecto solo se ejecutará cuando cambie el estado
    //changeJoke el cuál cambiará cuando se de clic en el botón de cambio de chiste
    useEffect(() => {
        const getJokeByCategory = async () => {
            console.log('Origin: ', jokeByCategory);
            console.log('Negación: ', !jokeByCategory);

            //Sentencia para saber si hay seleccionada alguna categoría
            //Si el estado jokeByCategory esta vacio el efecto consultará un chiste al azar
            //caso contrario consultará un chiste con la categoría que este seteada en jokeByCategory
            if (!jokeByCategory) {
                const data = await fetch(`https://api.chucknorris.io/jokes/random`)
                const jsonJoke = await data.json();
                console.log('a', jsonJoke)
                console.log('Categoría de la broma al azar: ', jokeByCategory)
                setJoke(jsonJoke);
            } else {
                console.log('Categoría de la broma: ', jokeByCategory)
                const data = await fetch(`https://api.chucknorris.io/jokes/random?category=${jokeByCategory}`)
                console.log('data', data);
                const jsonJoke = await data.json();
                console.log('b', jsonJoke)
                setJoke(jsonJoke);
            }
        }
        getJokeByCategory();
    }, [changeJoke])

    useEffect(() => {
        const getJokesByQuery = async () => {
            const data = await fetch(`https://api.chucknorris.io/jokes/search?query=${keyWord}`)
            const jsonJokesByQuery = await data.json();
            setJokesByQuery(jsonJokesByQuery.result);
            console.log('Jokes seteados', jsonJokesByQuery.result);
            console.log('DataJokes',data);
            console.log('Json', jsonJokesByQuery);
            console.log('Jokes', jokesByQuery);
            console.log('Query', keyWord);
            setIsLoading(false);
            //console.log(jsonJokesByQuery);
        }
        getJokesByQuery();
    }, [keyWord])

    //Función para el cambio de chiste
    const searchJoke = () => {
        setChangeJoke(!changeJoke);
    }

    //Función para setear la nueva categoría seleccionada
    const onGenderChange = value => {
        console.log(value);
        setJokeByCategory(value);
        console.log(setJokeByCategory)
    }

    const searchKeyWord = () => {
        let keyWordd = document.querySelector('#keyWord').value;
        console.log(keyWordd);
        setKeyWord(keyWordd);
        setChangeJokeQuery(!changeJokeQuery);
        console.log(setKeyWord);
        form.resetFields();
    }

    const columns = [
        {
            title: 'Texto',
            dataIndex: 'text',
            key: 'text',
        },
        {
            title: 'Categoría',
            dataIndex: 'category',
            key: 'category',
        }
    ]

    if (jokesByQuery) {
        var data = jokesByQuery.map((joke, index) => {
            console.log('Seteado', jokesByQuery);
            return {
                key: index,
                text: joke.value,
                category: <Text type="secondary">{joke.categories}</Text>,
            }
        })
    }
    
    return (
        <>
            <Row style={{marginTop: 40}} type="flex" justify="center">
                <Col >
                    <Title level={4} style={{textAlign: "center"}}>CHUCK NORRIS JOKES</Title>
                    <Form name="control-hooks" form={form}>
                        <Form.Item name="categoria" label="Categoria" rules={[{required: false}]}>
                            <Select
                                placeholder="Cualquier categoría"
                                onChange={onGenderChange}
                                allowClear
                            >
                                {
                                    jokeCategory ?
                                        jokeCategory.map((category) => (
                                            <Option value={category}>{category}</Option>
                                        ))
                                        : <Skeleton/>
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                    <Button type='primary' onClick={searchJoke} icon={<SearchOutlined/>}>Otra Broma</Button>
                </Col>
            </Row>

            <Row style={{marginTop: 40, marginBottom: 20}} type="flex" justify="center">
                <Col>
                    <Title level={3} style={{textAlign: "center"}}>{joke.value}</Title>
                </Col>
            </Row>

            <Row style={{marginTop: 40, marginBottom: 20}} type="flex" justify="center">
                <Col>
                    <Form name="control-hooks" form={form}>
                        <Form.Item name="Palabra clave" label="Palabra clave" rules={[{required: false}]}>
                            <Input id='keyWord'/>
                        </Form.Item>
                    </Form>
                    <Button type='primary' onClick={searchKeyWord} icon={<SearchOutlined/>}>Buscar</Button>
                </Col>
            </Row>

            <Row style={{marginTop: 40, marginBottom: 20}} type="flex" justify="center">
                <Col>
                    <Table columns={columns}
                           dataSource={data}
                           loading={isLoading}
                    />
                </Col>
            </Row>
        </>
    )
};

export default App;