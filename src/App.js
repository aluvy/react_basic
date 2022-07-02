import logo from './logo.svg';
import './App.css';
import {useState} from 'react'; // useState hook을 사용한다

function Header(props){
  return (
    <header>
      <h1><a href="/" onClick={(e) => {
        e.preventDefault();
        props.onChangeMode(); // 함수 호출 (함수이기 때문에 ())
      }}>{props.title}</a></h1>
    </header>
  );
}

function Article(props){
  return (
    <article>
      <h2>{props.title}</h2>
      <span>{props.body}</span>
    </article>
  );
}

function Nav(props){
  const lis = [];
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read'+t.id} onClick={(e) => {
        e.preventDefault();
        props.onChangeMode(Number(e.target.id));
      }}>{t.title}</a>
      </li>);
  }
  return (
    <nav>
      <ol>{lis}</ol>
    </nav>
  );
}

function Create(props){
  return (
    <article>
      <h2>Create</h2>
      <form onSubmit={(e)=>{
        e.preventDefault();
        const title = e.target.title.value;
        const body = e.target.body.value;
        props.onCreate(title, body);
      }}>
        <p><input type="text" name="title" placeholder="title"></input></p>
        <p><textarea name="body" placeholder="body"></textarea></p>
        <p><button type="submit">Create</button></p>
      </form>
    </article>
  );
}

function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return (
    <article>
      <h2>Update</h2>
      <form onSubmit={(e)=>{
        e.preventDefault();
        const title = e.target.title.value;
        const body = e.target.body.value;
        props.onUpdate(title, body);
      }}>
        <p><input type="text" name="title" value={title} onChange={(e)=>{setTitle(e.target.value)}} placeholder="title"></input></p>
        <p><textarea name="body" value={body} onChange={(e)=>{setBody(e.target.value)}} placeholder="body"></textarea></p>
        <p><button type="submit">Update</button></p>
      </form>
    </article>
    // react 에서 props로 전달한 데이터는 변경할 수 없다. 때문에 prop을 state로 환승시켜야 한다.
    // onChange = 값을 입력할때마다 호출 된다.
  );
}

function App() {

  let contextControl = null;

  // const [value, setValue] = useState(PRIMITIVE);
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);

  const [topics, setTopics] = useState([
    {id:1, title: 'html', body:'html is ... Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit, nostrum soluta! Vitae nobis porro aut optio assumenda reprehenderit excepturi enim voluptatem itaque beatae? Neque odio iusto tempore soluta porro repellat.'},
    {id:2, title: 'CSS', body: 'CSS is ... Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit, nostrum soluta! Vitae nobis porro aut optio assumenda reprehenderit excepturi enim voluptatem itaque beatae? Neque odio iusto tempore soluta porro repellat.'},
    {id:3, title: 'JavaScript', body: 'JavaScript is ... Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit, nostrum soluta! Vitae nobis porro aut optio assumenda reprehenderit excepturi enim voluptatem itaque beatae? Neque odio iusto tempore soluta porro repellat.'}
  ]);

  let content = null;

  if(mode === 'WELCOME'){
    content = <Article title="Welcome" body="Hello, I'm React Basic Source Code. Here, you can create a menu with create and modify or delete the generated menu. Have a nice day :)" />

  } else if (mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body} />
    contextControl = <>
      <li><a href={'/update/'+id} onClick={(e)=>{
        e.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
      <li><button type="button" onClick={()=>{
        console.log(id);
        const newTopics = [];
        for(let i=0; i<topics.length; i++){
          if(topics[i].id !== id){  // id가 다른 topics만 push
            newTopics.push(topics[i]);
          }
        };
        setTopics(newTopics);
        setMode('WELCOME');
      }}>Delete</button></li>
    </>

  } else if (mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body};
      const newTopics = [...topics]; // 1. 복제본 생성
      newTopics.push(newTopic);      // 2. 복제본 수정
      setTopics(newTopics);          // 3. 변경
      // topics 와 setTopics(newTopics)가 다르다면 APP() 재 랜더링 해준다.

      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  } else if (mode === 'UPDATE'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(_title, _body)=>{
      const newTopics = [...topics];  // 1. 복제본 생성
      const upDatedTopic = {id:id, title:_title, body:_body};
      for(let i=0; i<newTopics.length; i++){  // 2. 복제본 수정 (id값이 같은 배열을 찾아 수정)
        if(newTopics[i].id === id ){
          newTopics[i] = upDatedTopic;
          break;
        }
      }
      setTopics(newTopics); // 3. 변경
      // topics 와 setTopics(newTopics)가 다르다면 APP() 재 랜더링 해준다.
      setMode('READ');
    }}></Update>
  }

  return (
    <div>
      <Header title="React Basic" onChangeMode={() => {
        setMode('WELCOME');
      }} />
      <img src={logo} alt="React"></img>
      <Nav topics={topics} onChangeMode={(_id)=>{
        setMode('READ');
        setId(_id);
      }} />
      {content}
      <ul className="btn">
        <li><a href="/create" onClick={(e)=>{
          e.preventDefault();
          setMode('CREATE');
        }}>Create</a></li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;


/*
  컴포넌트 (독립된 부품)
  - function에 이름을 지정하여(첫글자는 꼭 대문자) 사용할 수 있다. */

/* 
  prop (속성) : 
  - 속성을 파라미터로 받아 사용할 수 있다. */

/* 
  Key
  리액트는 자동으로 생성한(for문) 태그의 경우에 태그를 추적할 수 있는 key prop이 있어야 한다. */

/*  State
  리액트 컴포넌트 함수는 입력(prop)과 출력(return)이 있다.
  prop을 통해서 입력된 데이터를 컴포넌트 함수가 처리해서 return값을 만들면 이 return값이 새로운 UI가 된다.
  prop과 함께 컴포넌트 함수를 다시 실행해서 새로운 리턴값을 만들어주는 또하나의 데이터 = State
  prop과 state 모두 값이 변경되면 새로운 return값을 만들어서 UI를 바꾼다
  prop : 컴포넌트를 사용하는 외부자를 위한 것
  State : 컴포넌트를 만드는 내부자를 위한 것
  
  
  const mode = 'WELCOME'; // 이것은 그냥 지역변수

  const _mode = useState('WELCOME'); // useState Hook 사용
  const mode = _mode[0];
  const setMode = _mode[1];

  const [mode, setMode] = useState('WELCOME');  // 위 3줄을 한줄로 표현
  
  useState 는 배열을 리턴한다. 
  0번째 배열에는 'WELCOME'(상태의 값을 읽을 때 쓰는 데이터, 초기값),
  1번째 배열에는 함수(상태의 값을 변경할 때 사용하는 함수) 바꿀때 
  
    const _mode = useState('WELCOME'); // useState Hook 사용
    const mode = _mode[0];
    const setMode = _mode[1];
    useState 는 배열을 리턴한다. 
    0번째 배열에는 'WELCOME'(상태의 값을 읽을 때 쓰는 데이터, 초기값),
    1번째 배열에는 함수(상태의 값을 변경할 때 사용하는 함수) 바꿀때

    const [mode, setMode] = useState('WELCOME');  // 한줄로 표현
    mode의 값이 바뀌면 APP()이 다시 실행된다.

  */