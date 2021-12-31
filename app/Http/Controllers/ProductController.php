<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($request->q != null) {
            $query = Product::where('name', 'like', '%'.$request->q.'%')->orWhere('description', 'like', '%'.$request->q.'%')->orderBy('created_at', 'desc');
        } else {
            $query = Product::orderBy('created_at', 'desc');
        }

        return inertia('Products', [
            'products' => $query->paginate(10),
            '_search' => $request->q ? $request->q : ''
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'nullable|numeric',
            'description' => 'nullable|string',
            'photo' => 'nullable|image'
        ]);

        $product = Product::make($request->only(['name', 'price', 'description']));
        $photo = $request->file('photo');
        if ($photo != null) {
            $photo->store('public');
            $product->photo = $photo->hashName();
        }

        $product->save();

        return redirect()->route('products.index');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'nullable|numeric',
            'description' => 'nullable|string',
            'photo' => 'nullable|image'
        ]);

        $product->fill($request->only(['name', 'price', 'description']));

        $photo = $request->file('photo');
        if ($photo != null) {
            if ($product->photo != null) {
                Storage::delete('public/'.$product->photo);
                $product->photo = null;
            }
            $photo->store('public');
            $product->photo = $photo->hashName();
        }

        $product->save();

        return redirect()->route('products.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Product $product)
    {
        if ($product->photo != null) {
            Storage::delete('public/'.$product->photo);
        }
        $product->delete();

        return redirect()->route('products.index');
    }
}
