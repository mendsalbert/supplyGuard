"use client";
import React, { FC, useState, useEffect, useRef } from "react";
import { Popover, Transition } from "@/app/headlessui";
import Prices from "@/components/Prices";
import { Product, PRODUCTS } from "@/data/data";
import { Fragment } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/api/client";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  fetchCart,
  fetchUserByAddress,
  removeProductFromCart,
  selectCurrentCart,
} from "@/features/user/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CartDropdown() {
  const dispatch = useAppDispatch();
  // const reduxCart = useAppSelector((state) => state.users.details.cart) as any;
  const reduxCart = useAppSelector(selectCurrentCart);

  const [isLoading, setisLoading] = useState(false);
  const builder = imageUrlBuilder(client);

  function urlFor(source: any) {
    return builder.image(source);
  }
  const user_ = useAppSelector((state) => state.users.currentUser) as any;

  useEffect(() => {
    const address = localStorage.getItem("address") as any;
    dispatch(fetchUserByAddress(JSON.parse(address)));
  }, [dispatch]);

  const handleRemove = async (productId: any) => {
    const id = toast.loading("Deleting...");
    setisLoading(true);
    let addedProductToCart = await dispatch(
      removeProductFromCart({ userId: user_._id, productId: productId })
    ).unwrap();
    toast.update(id, {
      render: "Item Removed from cart",
      type: "success",
      isLoading: false,
    });
    setisLoading(false);
  };

  const lastUserIdUsedForFetchingCart = useRef();

  useEffect(() => {
    if (user_?._id && user_?._id !== lastUserIdUsedForFetchingCart.current) {
      const fetchCartAsync = async () => {
        await dispatch(fetchCart(user_?._id));
        lastUserIdUsedForFetchingCart.current = user_?._id;
      };

      fetchCartAsync();
    }
  }, [dispatch, fetchCart, user_?._id, isLoading, reduxCart]);

  console.log("View Carts : CartDropdown.tsx", reduxCart);

  const renderTotal = () => {
    let priceTotal = 0;
    reduxCart
      ?.filter((item: any) => item !== null)
      .forEach((items, index) => {
        priceTotal += Number(items?.price);
      });

    return priceTotal;
  };

  const renderProduct = (item: any, index: number, close: () => void) => {
    const { name, price, supplier, description, status, image, _id } = item;

    return (
      <div key={index} className="flex py-5 last:pb-0">
        <ToastContainer />
        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            fill
            src={(image?.asset && urlFor(image.asset).url()) || ""}
            alt={name || ""}
            className="h-full w-full object-contain object-center"
          />
          <Link
            onClick={close}
            className="absolute inset-0"
            href={"/product-detail/3"}
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">
                  <Link onClick={close} href={"/product-detail/4"}>
                    {name || ""}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>{supplier?.supplierName}</span>
                  <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>
                  <span>{""}</span>
                </p>
              </div>
              <Prices price={price || ""} className="mt-0.5" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400">{`Qty 1`}</p>

            <div className="flex">
              <button
                type="button"
                onClick={() => {
                  handleRemove(_id);
                }}
                className="font-medium text-primary-6000 dark:text-primary-500 "
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`
                ${open ? "" : "text-opacity-90"}
                 group w-10 h-10 sm:w-12 sm:h-12 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative`}
          >
            <div className="w-3.5 h-3.5 flex items-center justify-center bg-primary-500 absolute top-1.5 right-1.5 rounded-full text-[10px] leading-none text-white font-medium">
              <span className="mt-[1px]">
                {
                  reduxCart?.filter((item: any) => item !== null).length // Filter out items with null fields
                }
              </span>
            </div>
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2H3.74001C4.82001 2 5.67 2.93 5.58 4L4.75 13.96C4.61 15.59 5.89999 16.99 7.53999 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H5.82001"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.25 22C16.9404 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9404 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.25 22C8.94036 22 9.5 21.4404 9.5 20.75C9.5 20.0596 8.94036 19.5 8.25 19.5C7.55964 19.5 7 20.0596 7 20.75C7 21.4404 7.55964 22 8.25 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 8H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <Link className="block md:hidden absolute inset-0" href={"/cart"} />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="hidden md:block absolute z-10 w-screen max-w-xs sm:max-w-md px-4 mt-3.5 -right-28 sm:right-0 sm:px-0">
              <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                <div className="relative bg-white dark:bg-neutral-800">
                  <div className="max-h-[60vh] p-5 overflow-y-auto hiddenScrollbar">
                    <h3 className="text-xl font-semibold">Shopping cart</h3>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                      {reduxCart
                        ?.filter((item: any) => item !== null) // Filter out items with null fields
                        .map((item: any, index: any) =>
                          renderProduct(item, index, close)
                        )}
                    </div>
                  </div>
                  <div className="bg-neutral-50 dark:bg-slate-900 p-5">
                    <p className="flex justify-between font-semibold text-slate-900 dark:text-slate-100">
                      <span>
                        <span>Subtotal</span>
                        <span className="block text-sm text-slate-500 dark:text-slate-400 font-normal">
                          Shipping and taxes calculated at checkout.
                        </span>
                      </span>
                      <span className="">${renderTotal()}</span>
                    </p>
                    <div className="flex space-x-2 mt-5">
                      <ButtonSecondary
                        href="/cart"
                        className="flex-1 border border-slate-200 dark:border-slate-700"
                        onClick={close}
                      >
                        View cart
                      </ButtonSecondary>
                      <ButtonPrimary
                        href="/checkout"
                        onClick={close}
                        className="flex-1"
                      >
                        Check out
                      </ButtonPrimary>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
