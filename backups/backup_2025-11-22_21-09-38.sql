--
-- PostgreSQL database dump
--

\restrict EWbwP3bgbKtzY6XIsa91E2XGpGyBicj9mapOXkCPS2Qcf2VmwfyjbHDhhmZmSfS

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: productos; Type: TABLE; Schema: public; Owner: mi_usuario
--

CREATE TABLE public.productos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    precio integer DEFAULT 0 NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    categoria character varying(20) NOT NULL,
    CONSTRAINT productos_categoria_check CHECK (((categoria)::text = ANY ((ARRAY['laptops'::character varying, 'smartphones'::character varying, 'audio'::character varying, 'wearables'::character varying])::text[])))
);


ALTER TABLE public.productos OWNER TO mi_usuario;

--
-- Name: productos_id_seq; Type: SEQUENCE; Schema: public; Owner: mi_usuario
--

CREATE SEQUENCE public.productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.productos_id_seq OWNER TO mi_usuario;

--
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mi_usuario
--

ALTER SEQUENCE public.productos_id_seq OWNED BY public.productos.id;


--
-- Name: productos id; Type: DEFAULT; Schema: public; Owner: mi_usuario
--

ALTER TABLE ONLY public.productos ALTER COLUMN id SET DEFAULT nextval('public.productos_id_seq'::regclass);


--
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: mi_usuario
--

COPY public.productos (id, nombre, descripcion, precio, stock, categoria) FROM stdin;
1	dell	notebook	20000	2	laptops
\.


--
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mi_usuario
--

SELECT pg_catalog.setval('public.productos_id_seq', 1, true);


--
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: mi_usuario
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict EWbwP3bgbKtzY6XIsa91E2XGpGyBicj9mapOXkCPS2Qcf2VmwfyjbHDhhmZmSfS

