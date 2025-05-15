// src/components/Button.jsx
const ButtonSimple = ({ onClick, label, style }) => {
    return (
      <button onClick={onClick} style={style}>
        {label}
      </button>
    );
  };
  
  export default ButtonSimple;
  