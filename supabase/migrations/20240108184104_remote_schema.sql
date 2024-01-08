revoke delete on table "public"."transaction" from "anon";

revoke insert on table "public"."transaction" from "anon";

revoke references on table "public"."transaction" from "anon";

revoke select on table "public"."transaction" from "anon";

revoke trigger on table "public"."transaction" from "anon";

revoke truncate on table "public"."transaction" from "anon";

revoke update on table "public"."transaction" from "anon";

revoke delete on table "public"."transaction" from "authenticated";

revoke insert on table "public"."transaction" from "authenticated";

revoke references on table "public"."transaction" from "authenticated";

revoke select on table "public"."transaction" from "authenticated";

revoke trigger on table "public"."transaction" from "authenticated";

revoke truncate on table "public"."transaction" from "authenticated";

revoke update on table "public"."transaction" from "authenticated";

revoke delete on table "public"."transaction" from "service_role";

revoke insert on table "public"."transaction" from "service_role";

revoke references on table "public"."transaction" from "service_role";

revoke select on table "public"."transaction" from "service_role";

revoke trigger on table "public"."transaction" from "service_role";

revoke truncate on table "public"."transaction" from "service_role";

revoke update on table "public"."transaction" from "service_role";

revoke delete on table "public"."transaction_type" from "anon";

revoke insert on table "public"."transaction_type" from "anon";

revoke references on table "public"."transaction_type" from "anon";

revoke select on table "public"."transaction_type" from "anon";

revoke trigger on table "public"."transaction_type" from "anon";

revoke truncate on table "public"."transaction_type" from "anon";

revoke update on table "public"."transaction_type" from "anon";

revoke delete on table "public"."transaction_type" from "authenticated";

revoke insert on table "public"."transaction_type" from "authenticated";

revoke references on table "public"."transaction_type" from "authenticated";

revoke select on table "public"."transaction_type" from "authenticated";

revoke trigger on table "public"."transaction_type" from "authenticated";

revoke truncate on table "public"."transaction_type" from "authenticated";

revoke update on table "public"."transaction_type" from "authenticated";

revoke delete on table "public"."transaction_type" from "service_role";

revoke insert on table "public"."transaction_type" from "service_role";

revoke references on table "public"."transaction_type" from "service_role";

revoke select on table "public"."transaction_type" from "service_role";

revoke trigger on table "public"."transaction_type" from "service_role";

revoke truncate on table "public"."transaction_type" from "service_role";

revoke update on table "public"."transaction_type" from "service_role";

revoke delete on table "public"."user" from "anon";

revoke insert on table "public"."user" from "anon";

revoke references on table "public"."user" from "anon";

revoke select on table "public"."user" from "anon";

revoke trigger on table "public"."user" from "anon";

revoke truncate on table "public"."user" from "anon";

revoke update on table "public"."user" from "anon";

revoke delete on table "public"."user" from "authenticated";

revoke insert on table "public"."user" from "authenticated";

revoke references on table "public"."user" from "authenticated";

revoke select on table "public"."user" from "authenticated";

revoke trigger on table "public"."user" from "authenticated";

revoke truncate on table "public"."user" from "authenticated";

revoke update on table "public"."user" from "authenticated";

revoke delete on table "public"."user" from "service_role";

revoke insert on table "public"."user" from "service_role";

revoke references on table "public"."user" from "service_role";

revoke select on table "public"."user" from "service_role";

revoke trigger on table "public"."user" from "service_role";

revoke truncate on table "public"."user" from "service_role";

revoke update on table "public"."user" from "service_role";

alter table "public"."transaction" drop constraint "transaction_transaction_code_unique";

alter table "public"."transaction" drop constraint "transaction_type_transaction_type_id_fk";

alter table "public"."transaction" drop constraint "transaction_user_id_user_id_fk";

alter table "public"."transaction_type" drop constraint "transaction_type_description_unique";

alter table "public"."transaction_type" drop constraint "transaction_type_name_unique";

alter table "public"."user" drop constraint "user_email_unique";

alter table "public"."user" drop constraint "user_password_unique";

alter table "public"."user" drop constraint "user_phone_number_unique";

alter table "public"."user" drop constraint "user_username_unique";

alter table "public"."transaction" drop constraint "transaction_pkey";

alter table "public"."transaction_type" drop constraint "transaction_type_pkey";

alter table "public"."user" drop constraint "user_pkey";

drop index if exists "public"."transaction_pkey";

drop index if exists "public"."transaction_transaction_code_unique";

drop index if exists "public"."transaction_type_description_unique";

drop index if exists "public"."transaction_type_name_unique";

drop index if exists "public"."transaction_type_pkey";

drop index if exists "public"."user_email_unique";

drop index if exists "public"."user_password_unique";

drop index if exists "public"."user_phone_number_unique";

drop index if exists "public"."user_pkey";

drop index if exists "public"."user_username_unique";

drop table "public"."transaction";

drop table "public"."transaction_type";

drop table "public"."user";

drop sequence if exists "public"."transaction_id_seq";

drop sequence if exists "public"."transaction_type_id_seq";

drop sequence if exists "public"."user_id_seq";


