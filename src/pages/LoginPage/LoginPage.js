import React, { useState, useContext } from "react";
import styled from "styled-components";
import { MEDIA_QUERY_SM } from "../../constants/breakpoint";
import { Wrapper, Container } from "../../layout/mainLayout";
import { login, getMe } from "../../WebAPI";
import { setAuthToken } from "../../utils";
import { AuthContext } from "../../contexts";
import { useHistory, Link } from "react-router-dom";
import {
  AiFillEye as VisibilityIcon,
  AiFillEyeInvisible as VisibilityOffIcon,
} from "react-icons/ai";
import { FaUser as PersonIcon, FaLock as LockIcon } from "react-icons/fa";

const LoginForm = styled.form`
  position: relative;
  margin: 0 auto;
  padding: 40px 40px 50px 40px;
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.background.primary};
  box-shadow: ${({ theme }) => theme.boxShadow.primary};

  ${MEDIA_QUERY_SM} {
    margin-top: 30px;
    padding: 30px 30px 40px 30px;
  }
`;

const Title = styled.p`
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
  color: ${({ theme }) => theme.button.submit};
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 20px;

  & > svg {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.button.submit};
  }
`;
const InputField = styled.input`
  width: 100%;
  padding: 5px 10px 5px 40px;
  height: 45px;
  border: solid 1px transparent;
  border-radius: 3px;
  font-size: 16px;
  color: ${({ theme }) => theme.text.primary};
  background-color: ${({ theme }) => theme.background.body};
  transition: 0.3s;

  &:focus {
    border: solid 1px ${({ theme }) => theme.primary};
  }
`;

const ShowPasswordIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  cursor: pointer;

  svg {
    color: ${({ theme }) => theme.button.submit};
    width: 100%;
    height: auto;
  }
`;

const PasswordInputField = styled(InputField)`
  padding: 5px 40px 5px 40px;
`;

const RegisterLink = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  text-decoration: none;
  color: ${({ theme }) => theme.text.remind};
  transition: 0.3s;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px 0;
  color: ${({ theme }) => theme.text.negative};
  background-color: ${({ theme }) => theme.button.submit};
  border: transparent;
  border-radius: 3px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const ErrorText = styled.div`
  position: absolute;
  bottom: 12px;
  color: ${({ theme }) => theme.error};
`;

export default function LoginPage() {
  const { setUser } = useContext(AuthContext); // ????????? setUser
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("Lidemy");
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!username || !password) {
      e.preventDefault();
      return setErrorMessage("????????????????????????");
    }
    login(username, password).then((data) => {
      if (data.ok === 0) {
        // ????????????
        return setErrorMessage(data.message); // ????????????????????????????????????
      }
      setAuthToken(data.token);

      getMe().then((response) => {
        if (response.ok !== 1) {
          // ????????????
          setAuthToken(null); // ???????????????????????????????????????
          return setErrorMessage(response.toString());
        }
        setUser(response.data); // ??????????????? user
      });
      history.push("/");
    });
  };

  const handleInputChange = (e) => {
    setErrorMessage("");
    if (e.target.name === "username") {
      setUsername(e.target.value);
    }
    if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const handlePasswordShow = (e) => {
    setIsPasswordShow(!isPasswordShow);
  };

  return (
    <Wrapper>
      <Container>
        <LoginForm onSubmit={handleSubmit}>
          <Title>??????</Title>
          <InputContainer>
            <PersonIcon />
            <InputField
              type="text"
              name="username"
              value={username}
              placeholder="??????"
              onChange={handleInputChange}
            />
          </InputContainer>
          <InputContainer>
            <LockIcon />
            <PasswordInputField
              type={isPasswordShow ? "text" : "password"}
              name="password"
              value={password}
              placeholder="??????"
              onChange={handleInputChange}
            />
            <ShowPasswordIcon onClick={handlePasswordShow}>
              {isPasswordShow ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </ShowPasswordIcon>
          </InputContainer>
          <RegisterLink to="/register">?????????????????????????????????</RegisterLink>
          <SubmitButton>??????</SubmitButton>
          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        </LoginForm>
      </Container>
    </Wrapper>
  );
}
