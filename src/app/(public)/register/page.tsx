"use client";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SignUpForm from "@/components/auth/SignUpForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="h-10 w-10 rounded-lg excel-gradient flex items-center justify-center">
              <span className="text-white font-bold text-lg">EP</span>
            </div>
            <span className="font-bold text-xl text-gray-900">ExcelPilot</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join ExcelPilot to get started with AI-powered Excel assistance
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create your account to get started with ExcelPilot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}