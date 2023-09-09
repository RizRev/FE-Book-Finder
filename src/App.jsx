import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import book from './assets/Book.png'
import axios from 'axios';
import './App.css'

function App() {
  const [title, setTitle] = useState('')
  const [data, setData] = useState([])
  const [isLoading,setIsLoading] = useState(false)

  const handleInputChange = (event) => {
    setTitle(event.target.value)
  }

  const submit = async () => {
    setIsLoading(true)
    console.log('ini submit:', title)
    axios.get(`https://www.googleapis.com/books/v1/volumes?q={${title}}`)
    .then(res => {
      setIsLoading(false)
      console.log('ini hasilnya :',res.data.items)
      setData(res.data.items)
      // console.log('ini data : ',data.volumeInfo.averageRating)
    })
    .catch(error => 
      console.error('ini error : ',error)
    )

  }

  // const saveFavorite = async() => {
  //   await fetch
  // }

  return (
    <>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Find Book ..."
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          value={title}
          onChange={handleInputChange}
        />
        <Button 
          // style={{backgroundColor: 'blue'}}
          variant="primary" 
          // id="button-addon2" 
          onClick={submit}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...':'Search'}
        </Button>
      </InputGroup>
<button class="button-82-pushable" role="button">
  <span class="button-82-shadow"></span>
  <span class="button-82-edge"></span>
  <span class="button-82-front text">
    Button 82
  </span>
</button>
      <div className='flex'>
      {data.map((item,index)=>(
        <div key={index}>
          <Card className='kotak'>
          <Card.Img variant="top" style={{height:175}} src={item.volumeInfo.imageLinks?.thumbnail ? item.volumeInfo.imageLinks?.thumbnail : book} />
          <Card.Body style={{display:'flex',alignItems:'center',alignSelf:'center'}}>
          
          <Card.Title style={{color: 'black',textAlign:'center'}}>{item.volumeInfo?.title}</Card.Title>
          <Card.Text style={{color: 'black'}}>
          {item.volumeInfo?.averageRating}
          </Card.Text>
          </Card.Body>
          <ListGroup className="list-group-flush">
            {item.volumeInfo.authors ? (item.volumeInfo.authors.map((authors) => (
              <ListGroup.Item style={{color: 'black'}}>{authors}</ListGroup.Item>
            ))) : <ListGroup.Item style={{color: 'black'}}>{'Anonymous'}</ListGroup.Item>}
          </ListGroup>
          <Card.Body>
            <Card.Link href="#">Card Link</Card.Link>
            <Card.Link href="#">Another Link</Card.Link>
          </Card.Body>
        </Card>
        </div>
      ))}
      </div>
    </>
  )
}

export default App

