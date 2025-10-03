import { NextRequest, NextResponse } from "next/server";

// Mock blog data for demo
const mockBlogs = [
  {
    id: 1,
    title: "Complete Guide to Property Registration in Delhi",
    slug: "property-registration-delhi-guide",
    excerpt: "Learn the step-by-step process of registering property in Delhi, required documents, fees, and timeline.",
    bodyMd: `# Complete Guide to Property Registration in Delhi\n\nProperty registration is a crucial legal process...`,
    tags: ["Property Registration", "Delhi", "Legal", "Guide"],
    heroUrl: null,
    status: "published",
    publishedAt: "2025-01-15T10:00:00Z",
    author: {
      id: 1,
      name: "Priya Sharma",
    },
  },
  {
    id: 2,
    title: "How to Convert Agricultural Land to Residential in Rajasthan",
    slug: "convert-agricultural-land-rajasthan",
    excerpt: "A comprehensive guide on converting agricultural land to residential use in Rajasthan, including fees, procedures, and timeline.",
    bodyMd: `# How to Convert Agricultural Land to Residential\n\nConverting agricultural land...`,
    tags: ["Land Conversion", "Rajasthan", "Legal", "Agriculture"],
    heroUrl: null,
    status: "published",
    publishedAt: "2025-01-10T14:30:00Z",
    author: {
      id: 2,
      name: "Amit Kumar",
    },
  },
  {
    id: 3,
    title: "Understanding RERA: Homebuyer's Rights and Protection",
    slug: "understanding-rera-homebuyer-rights",
    excerpt: "Everything you need to know about RERA regulations, your rights as a homebuyer, and how to file complaints.",
    bodyMd: `# Understanding RERA\n\nRERA (Real Estate Regulatory Authority)...`,
    tags: ["RERA", "Legal", "Homebuyer", "Rights"],
    heroUrl: null,
    status: "published",
    publishedAt: "2025-01-05T09:00:00Z",
    author: {
      id: 1,
      name: "Priya Sharma",
    },
  },
  {
    id: 4,
    title: "Top 10 Building Materials for Monsoon Construction",
    slug: "building-materials-monsoon-construction",
    excerpt: "Discover the best materials to use during monsoon season for durable and water-resistant construction.",
    tags: ["Construction", "Materials", "Monsoon", "Guide"],
    heroUrl: null,
    status: "published",
    publishedAt: "2025-01-01T11:00:00Z",
    author: {
      id: 3,
      name: "Rajesh Patel",
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const tag = searchParams.get("tag");

    let filteredBlogs = [...mockBlogs];

    // Filter by search query
    if (search) {
      filteredBlogs = filteredBlogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(search.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by tag
    if (tag) {
      filteredBlogs = filteredBlogs.filter((blog) => blog.tags.includes(tag));
    }

    return NextResponse.json({
      blogs: filteredBlogs,
      total: filteredBlogs.length,
    });
  } catch (error: any) {
    console.error("Blogs API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // This would typically require admin authentication
    const body = await request.json();
    const { title, excerpt, bodyMd, tags } = body;

    if (!title || !excerpt || !bodyMd) {
      return NextResponse.json(
        { error: "Title, excerpt, and body are required" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newBlog = {
      id: mockBlogs.length + 1,
      title,
      slug,
      excerpt,
      bodyMd,
      tags: tags || [],
      heroUrl: null,
      status: "draft",
      publishedAt: null,
      author: {
        id: 1,
        name: "Admin",
      },
    };

    // In a real app, save to database
    mockBlogs.push(newBlog as any);

    return NextResponse.json({
      blog: newBlog,
      message: "Blog created successfully",
    });
  } catch (error: any) {
    console.error("Create blog error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create blog" },
      { status: 500 }
    );
  }
}