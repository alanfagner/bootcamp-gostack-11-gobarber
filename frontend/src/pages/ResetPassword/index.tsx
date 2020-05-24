import React, { useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { useHistory, useLocation } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { Container, Content, AnimationContainer, Background } from './styles';

import { useToast } from '../../hooks/Toast';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  passwordConfirmation: string;
}

const ResetPassword: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          passwordConfirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Confirmação incorreta',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        const { password, passwordConfirmation } = data;
        const token = location.search.replace('?token=', '');
        console.log(token);
        if (!token) {
          throw new Error('');
        }

        await api.post('password/reset', {
          password,
          passwordConfirmation,
          token,
        });

        history.push('');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const erros = getValidationErrors(error);

          formRef.current?.setErrors(erros);
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar a senha, tente novamente.',
        });
      }
    },
    [addToast, history, location],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

            <Input
              name="password"
              icon={FiLock}
              type="Password"
              placeholder="Nova senha"
            />

            <Input
              name="passwordConfirmation"
              icon={FiLock}
              type="Password"
              placeholder="Confirmação da nova senha"
            />

            <Button type="submit">Entrar</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
